// src/application/use-cases/handle-payment-gateway-event.use-case.ts

import { Injectable, Inject, BadRequestException, ForbiddenException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { PaymentGatewayEventDto } from 'src/interfaces/dtos/paymentgateway-event-dto';
import configuration from '../../infrastructure/config/configuration';
import { TransactionStatus } from '@prisma/client';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';

@Injectable()
export class HandlePaymentGatewayEventUseCase {
    private readonly logger = new Logger(HandlePaymentGatewayEventUseCase.name);
    private readonly paymentGatewayEventsSecret: string | undefined;

    constructor(
        @Inject(TransactionRepositoryPort)
        private readonly transactionRepository: TransactionRepositoryPort,
        private readonly configService: ConfigService,
        private readonly productRepository: ProductRepositoryPort,
    ) {
        this.paymentGatewayEventsSecret = this.configService.get<string>('payment_gateway.eventsSecret');
    }

    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    private validateSignature(eventDto: PaymentGatewayEventDto): boolean {
        if (!this.configService.get<string>('payment_gateway.eventsSecret')) {
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
        } catch (error) {
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
        // Log without the secret
        // this.logger.debug(`String Used for Signing: ${finalStringToSign.replace(this.paymentGatewayEventsSecret, '********SECRET********')}`);

        return calculatedChecksum === providedChecksum.toUpperCase();
    }

    async execute(eventDto: PaymentGatewayEventDto): Promise<void> {
        this.logger.log(`Received payment gateway event: ${eventDto.event} for reference ${eventDto.data?.transaction?.reference}`);

        // 1. Validate Signature
        if (!this.validateSignature(eventDto)) {
            this.logger.warn(`Invalid signature for event reference: ${eventDto.data?.transaction?.reference}. Event ignored.`);
            return;
        }

        this.logger.log(`Signature validated successfully for event reference: ${eventDto.data?.transaction?.reference}`);

        // 2. Process based on event type
        if (eventDto.event === 'transaction.updated') {
            // data & transaction are required before destructuring
            if (!eventDto.data?.transaction) {
                this.logger.error('Missing data.transaction in transaction.updated event.');
                throw new BadRequestException('Missing transaction data in event');
            }
            const { reference, status } = eventDto.data.transaction;

            this.logger.log({"Reference": reference, "Status": status});

            if (!reference || !status) {
                this.logger.error('Missing reference or status in transaction.updated event data.');
                throw new BadRequestException('Missing reference or status in event data');
            }

            try {
                // Convert the status string to TransactionStatus enum and verify if it's a TransactionStatus value
                const transactionStatus = this.mapGatewayStatusToTransactionStatus(status);

                // If the status is not APPROVED, restore stock
                if (transactionStatus !== TransactionStatus.APPROVED) {
                    this.logger.log(`Transaction ${reference} has non-approved status: ${transactionStatus}. Restoring stock.`);
                    
                    try {
                        // Obtener la transacción con su información de productos
                        // Get the transaction with its product information
                        const transaction = await this.transactionRepository.findByReference(reference);
                        this.logger.log(transaction)
                        if (transaction && transaction.products && transaction.products.length > 0) {
                            for (const product of transaction.products) {
                                await this.productRepository.increaseStock(product.product_id, product.quantity);
                                this.logger.log(`Restored ${product.quantity} units to product ${product.product_id}`);
                            }
                        } else {
                            this.logger.warn(`No products found for transaction ${reference} or transaction not found`);
                        }
                    } catch (stockError) {
                        this.logger.error(`Error restoring stock for transaction ${reference}: ${stockError.message}`, stockError.stack);
                    }
                }
                
                // 3. Update transaction status in the database
                const updatedTransaction = await this.transactionRepository.updateStatusByReference(
                    reference,
                    transactionStatus,
                );

                if (updatedTransaction === null) {
                    // The transaction was not found by the repository
                    this.logger.warn(`Transaction with reference ${reference} not found during update attempt.`);
                    throw new NotFoundException(`Transaction with reference ${reference} not found`);
                }

                this.logger.log(`Transaction ${reference} status updated to ${transactionStatus}`);

            } catch (error) {
                // Handle repository errors or other unexpected errors
                this.logger.error(`Error processing event for reference ${reference}: ${error.message}`, error.stack);
                if (error instanceof BadRequestException || error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
                    throw error;
                }
                throw new InternalServerErrorException(`Unexpected error processing event: ${error.message}`);
            }
        } else {
            // Nothing to do for unhandled event types
            this.logger.log(`Received unhandled event type: ${eventDto.event}. Ignoring.`);
        }
    }

    // Method to map the payment gateway status to the TransactionStatus enum
    private mapGatewayStatusToTransactionStatus(gatewayStatus: string): TransactionStatus {
        switch (gatewayStatus.toUpperCase()) {
            case 'APPROVED':
                return TransactionStatus.APPROVED;
            case 'DECLINED':
            case 'FAILED':
                return TransactionStatus.DECLINED;
            case 'PENDING':
                return TransactionStatus.PENDING;
            case 'ERROR':
                return TransactionStatus.ERROR;
            default:
                this.logger.warn(`Unknown payment gateway status: ${gatewayStatus}, defaulting to ERROR`);
                return TransactionStatus.ERROR;
        }
    }
}