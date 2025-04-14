"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var HandlePaymentGatewayEventUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlePaymentGatewayEventUseCase = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = require("crypto");
const transaction_repository_port_1 = require("../../domain/ports/transaction.repository.port");
const client_1 = require("@prisma/client");
const product_repository_port_1 = require("../../domain/ports/product.repository.port");
let HandlePaymentGatewayEventUseCase = HandlePaymentGatewayEventUseCase_1 = class HandlePaymentGatewayEventUseCase {
    transactionRepository;
    configService;
    productRepository;
    logger = new common_1.Logger(HandlePaymentGatewayEventUseCase_1.name);
    paymentGatewayEventsSecret;
    constructor(transactionRepository, configService, productRepository) {
        this.transactionRepository = transactionRepository;
        this.configService = configService;
        this.productRepository = productRepository;
        this.paymentGatewayEventsSecret = this.configService.get('payment_gateway.eventsSecret');
    }
    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
    validateSignature(eventDto) {
        if (!this.configService.get('payment_gateway.eventsSecret')) {
            this.logger.error('Cannot validate signature: PAYMENT_GATEWAY_EVENTS_SECRET is missing.');
            return false;
        }
        const { data, timestamp, signature } = eventDto;
        const properties = signature.properties;
        const providedChecksum = signature.checksum;
        let concatenatedValues = '';
        try {
            concatenatedValues = properties
                .map(propPath => {
                const value = this.getNestedValue(data, propPath);
                if (value === undefined || value === null) {
                    throw new Error(`Property "${propPath}" not found or is null in event data required for signature.`);
                }
                return String(value);
            })
                .join('');
        }
        catch (error) {
            this.logger.error(`Error accessing properties for signature calculation: ${error.message}`, error.stack);
            return false;
        }
        const stringToSign = concatenatedValues + String(timestamp);
        const finalStringToSign = stringToSign + this.paymentGatewayEventsSecret;
        const calculatedChecksum = crypto
            .createHash('sha256')
            .update(finalStringToSign)
            .digest('hex')
            .toUpperCase();
        this.logger.debug(`Provided Checksum: ${providedChecksum}`);
        this.logger.debug(`Calculated Checksum: ${calculatedChecksum}`);
        return calculatedChecksum === providedChecksum.toUpperCase();
    }
    async execute(eventDto) {
        this.logger.log(`Received payment gateway event: ${eventDto.event} for reference ${eventDto.data?.transaction?.reference}`);
        if (!this.validateSignature(eventDto)) {
            this.logger.warn(`Invalid signature for event reference: ${eventDto.data?.transaction?.reference}. Event ignored.`);
            return;
        }
        this.logger.log(`Signature validated successfully for event reference: ${eventDto.data?.transaction?.reference}`);
        if (eventDto.event === 'transaction.updated') {
            if (!eventDto.data?.transaction) {
                this.logger.error('Missing data.transaction in transaction.updated event.');
                throw new common_1.BadRequestException('Missing transaction data in event');
            }
            const { reference, status } = eventDto.data.transaction;
            this.logger.log({ "Reference": reference, "Status": status });
            if (!reference || !status) {
                this.logger.error('Missing reference or status in transaction.updated event data.');
                throw new common_1.BadRequestException('Missing reference or status in event data');
            }
            try {
                const transactionStatus = this.mapGatewayStatusToTransactionStatus(status);
                if (transactionStatus !== client_1.TransactionStatus.APPROVED) {
                    this.logger.log(`Transaction ${reference} has non-approved status: ${transactionStatus}. Restoring stock.`);
                    try {
                        const transaction = await this.transactionRepository.findByReference(reference);
                        this.logger.log(transaction);
                        if (transaction && transaction.products && transaction.products.length > 0) {
                            for (const product of transaction.products) {
                                await this.productRepository.increaseStock(product.product_id, product.quantity);
                                this.logger.log(`Restored ${product.quantity} units to product ${product.product_id}`);
                            }
                        }
                        else {
                            this.logger.warn(`No products found for transaction ${reference} or transaction not found`);
                        }
                    }
                    catch (stockError) {
                        this.logger.error(`Error restoring stock for transaction ${reference}: ${stockError.message}`, stockError.stack);
                    }
                }
                const updatedTransaction = await this.transactionRepository.updateStatusByReference(reference, transactionStatus);
                if (updatedTransaction === null) {
                    this.logger.warn(`Transaction with reference ${reference} not found during update attempt.`);
                    throw new common_1.NotFoundException(`Transaction with reference ${reference} not found`);
                }
                this.logger.log(`Transaction ${reference} status updated to ${transactionStatus}`);
            }
            catch (error) {
                this.logger.error(`Error processing event for reference ${reference}: ${error.message}`, error.stack);
                if (error instanceof common_1.BadRequestException || error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException || error instanceof common_1.InternalServerErrorException) {
                    throw error;
                }
                throw new common_1.InternalServerErrorException(`Unexpected error processing event: ${error.message}`);
            }
        }
        else {
            this.logger.log(`Received unhandled event type: ${eventDto.event}. Ignoring.`);
        }
    }
    mapGatewayStatusToTransactionStatus(gatewayStatus) {
        switch (gatewayStatus.toUpperCase()) {
            case 'APPROVED':
                return client_1.TransactionStatus.APPROVED;
            case 'DECLINED':
            case 'FAILED':
                return client_1.TransactionStatus.DECLINED;
            case 'PENDING':
                return client_1.TransactionStatus.PENDING;
            case 'ERROR':
                return client_1.TransactionStatus.ERROR;
            default:
                this.logger.warn(`Unknown payment gateway status: ${gatewayStatus}, defaulting to ERROR`);
                return client_1.TransactionStatus.ERROR;
        }
    }
};
exports.HandlePaymentGatewayEventUseCase = HandlePaymentGatewayEventUseCase;
exports.HandlePaymentGatewayEventUseCase = HandlePaymentGatewayEventUseCase = HandlePaymentGatewayEventUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(transaction_repository_port_1.TransactionRepositoryPort)),
    __metadata("design:paramtypes", [transaction_repository_port_1.TransactionRepositoryPort,
        config_1.ConfigService,
        product_repository_port_1.ProductRepositoryPort])
], HandlePaymentGatewayEventUseCase);
//# sourceMappingURL=handle-payment-gateway-event.use-case.js.map