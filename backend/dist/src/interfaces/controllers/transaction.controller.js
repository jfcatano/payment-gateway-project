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
var TransactionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const create_transaction_use_case_1 = require("../../application/use-cases/create-transaction.use-case");
const create_transaction_dto_1 = require("../dtos/create-transaction.dto");
const find_transaction_by_user_email_case_1 = require("../../application/use-cases/find-transaction-by-user-email.case");
const handle_payment_gateway_event_use_case_1 = require("../../application/use-cases/handle-payment-gateway-event.use-case");
let TransactionController = TransactionController_1 = class TransactionController {
    createTransaction;
    findTransactionByUserEmail;
    handlePaymentGatewayEvent;
    logger = new common_1.Logger(TransactionController_1.name);
    constructor(createTransaction, findTransactionByUserEmail, handlePaymentGatewayEvent) {
        this.createTransaction = createTransaction;
        this.findTransactionByUserEmail = findTransactionByUserEmail;
        this.handlePaymentGatewayEvent = handlePaymentGatewayEvent;
    }
    async create(dto) {
        const result = await this.createTransaction.execute(dto);
        if (result.isErr())
            throw new Error(result.error.message);
        return { success: true, message: 'Transaction created', transaction_data: result.value };
    }
    async getTransactionsByUserEmail(email) {
        const result = await this.findTransactionByUserEmail.execute(email);
        if (result.isErr())
            throw new Error(result.error.message);
        return { data: result.value };
    }
    async handlePaymentGatewayEvents(eventDto) {
        try {
            await this.handlePaymentGatewayEvent.execute(eventDto);
            this.logger.log(`Payment Gateway event ${eventDto.event} processed successfully for ref ${eventDto.data?.transaction?.reference}`);
        }
        catch (error) {
        }
        return { message: 'Evento received' };
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionsByUserEmail", null);
__decorate([
    (0, common_1.Post)('payment_gateway/events'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "handlePaymentGatewayEvents", null);
exports.TransactionController = TransactionController = TransactionController_1 = __decorate([
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [create_transaction_use_case_1.CreateTransactionUseCase,
        find_transaction_by_user_email_case_1.GetTransactionsByUserEmailUseCase,
        handle_payment_gateway_event_use_case_1.HandlePaymentGatewayEventUseCase])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map