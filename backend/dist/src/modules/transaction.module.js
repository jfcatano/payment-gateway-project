"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_controller_1 = require("../interfaces/controllers/transaction.controller");
const create_transaction_use_case_1 = require("../application/use-cases/create-transaction.use-case");
const product_repository_1 = require("../infrastructure/adapters/product.repository");
const transaction_repository_port_1 = require("../domain/ports/transaction.repository.port");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
const transaction_repository_1 = require("../infrastructure/adapters/transaction.repository");
const find_transaction_by_user_email_case_1 = require("../application/use-cases/find-transaction-by-user-email.case");
const handle_payment_gateway_event_use_case_1 = require("../application/use-cases/handle-payment-gateway-event.use-case");
const config_1 = require("@nestjs/config");
const product_module_1 = require("./product.module");
let TransactionModule = class TransactionModule {
};
exports.TransactionModule = TransactionModule;
exports.TransactionModule = TransactionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            product_module_1.ProductModule
        ],
        controllers: [transaction_controller_1.TransactionController],
        providers: [
            prisma_service_1.PrismaService,
            create_transaction_use_case_1.CreateTransactionUseCase,
            find_transaction_by_user_email_case_1.GetTransactionsByUserEmailUseCase,
            handle_payment_gateway_event_use_case_1.HandlePaymentGatewayEventUseCase,
            product_repository_1.PrismaProductRepository,
            {
                provide: transaction_repository_port_1.TransactionRepositoryPort,
                useClass: transaction_repository_1.PrismaTransactionRepository,
            },
        ],
    })
], TransactionModule);
//# sourceMappingURL=transaction.module.js.map