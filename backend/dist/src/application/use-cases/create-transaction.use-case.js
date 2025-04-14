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
var CreateTransactionUseCase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_util_1 = require("../../shared/utils/result.util");
const transaction_repository_port_1 = require("../../domain/ports/transaction.repository.port");
const generate_signature_1 = require("../../shared/utils/generate-signature");
const product_repository_port_1 = require("../../domain/ports/product.repository.port");
const prisma_service_1 = require("../../infrastructure/prisma/prisma.service");
let CreateTransactionUseCase = CreateTransactionUseCase_1 = class CreateTransactionUseCase {
    repo;
    productRepo;
    prismaService;
    logger = new common_1.Logger(CreateTransactionUseCase_1.name);
    constructor(repo, productRepo, prismaService) {
        this.repo = repo;
        this.productRepo = productRepo;
        this.prismaService = prismaService;
    }
    async execute(dto) {
        this.logger.log(`Starting execution for the customer: ${dto.customer.email}`);
        return result_util_1.ResultAsync.fromPromise(this.prismaService.executeTransaction(async (tx) => {
            this.logger.log(`In the DB transaction.`);
            for (const item of dto.products) {
                this.logger.log(`Decrementando stock para producto ${item.product_id} (cantidad: ${item.quantity})...`);
                const success = await this.productRepo.decreaseStock(item.product_id, item.quantity, tx);
            }
            this.logger.log(`Creating transaction registry...`);
            const transactionEntity = await this.repo.create(dto, tx);
            return transactionEntity;
        }), (error) => {
            this.logger.error(`Error in trasaction execution`, error);
            return error instanceof result_util_1.BusinessError
                ? error
                : new result_util_1.DatabaseError('Error creating transaction', { original: error });
        }).map((transactionResult) => {
            const currency = 'COP';
            const amount_in_cents = Math.round(transactionResult.amount * 100).toString();
            const signature = (0, generate_signature_1.generateTransactionSignature)({
                reference: transactionResult.id,
                amount_in_cents: parseInt(amount_in_cents),
                currency,
            });
            return {
                signature,
                reference: transactionResult.id,
                amount_in_cents,
                currency,
            };
        });
    }
};
exports.CreateTransactionUseCase = CreateTransactionUseCase;
exports.CreateTransactionUseCase = CreateTransactionUseCase = CreateTransactionUseCase_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_port_1.TransactionRepositoryPort,
        product_repository_port_1.ProductRepositoryPort,
        prisma_service_1.PrismaService])
], CreateTransactionUseCase);
//# sourceMappingURL=create-transaction.use-case.js.map