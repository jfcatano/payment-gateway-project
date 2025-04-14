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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const transaction_entity_1 = require("../../domain/entities/transaction.entity");
let PrismaTransactionRepository = class PrismaTransactionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, tx) {
        const prismaClient = tx || this.prisma;
        const product_id = "703b6065-6118-45f3-8958-601539c88a08";
        const created = await prismaClient.transaction.create({
            data: {
                amount: data.amount,
                base_fee: data.base_fee,
                delivery_fee: data.delivery_fee,
                transaction_id: data.transaction_id,
                payment_method_token: data.payment_method_token,
                customer: {
                    connectOrCreate: {
                        where: { email: data.customer.email },
                        create: {
                            name: data.customer.name,
                            email: data.customer.email,
                            addressLine1: data.customer.addressLine1,
                            addressLine2: data.customer.addressLine2,
                            city: data.customer.city,
                            country: data.customer.country,
                        }
                    }
                }
            },
        });
        await Promise.all(data.products.map(async (product) => {
            return prismaClient.transactionProduct.create({
                data: {
                    transaction_id: created.id,
                    name: product.name,
                    product_id: product.product_id,
                    quantity: product.quantity,
                    price: product.price,
                }
            });
        }));
        return new transaction_entity_1.Transaction(created.id, created.amount, created.status, created.base_fee, created.delivery_fee, data.products, created.transaction_id ?? undefined, created.payment_method_token ?? undefined, created.createdAt, created.updatedAt);
    }
    async findByUserEmail(email) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                customer: {
                    email: email,
                },
            },
            include: {
                transactionProducts: {
                    include: {
                        products: true,
                    }
                }
            }
        });
        return transactions.map((transaction) => {
            const products = transaction.transactionProducts.map(tp => ({
                product_id: tp.product_id,
                quantity: tp.quantity,
                name: tp.name,
                price: tp.price,
            }));
            return new transaction_entity_1.Transaction(transaction.id, transaction.amount, transaction.status, transaction.base_fee, transaction.delivery_fee, products, transaction.transaction_id ?? undefined, transaction.payment_method_token ?? undefined, transaction.createdAt, transaction.updatedAt);
        });
    }
    async findByReference(reference) {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id: reference,
            },
            include: {
                transactionProducts: {
                    include: {
                        products: true,
                    }
                }
            }
        });
        if (!transaction)
            return null;
        const products = transaction.transactionProducts.map(tp => ({
            product_id: tp.product_id,
            quantity: tp.quantity,
            name: tp.name,
            price: tp.price,
        }));
        return new transaction_entity_1.Transaction(transaction.id, transaction.amount, transaction.status, transaction.base_fee, transaction.delivery_fee, products, transaction.transaction_id ?? undefined, transaction.payment_method_token ?? undefined, transaction.createdAt, transaction.updatedAt);
    }
    async updateStatusByReference(reference, status) {
        try {
            const transactionStatus = status;
            const updated = await this.prisma.transaction.update({
                where: { id: reference },
                data: { status: transactionStatus },
                include: {
                    transactionProducts: {
                        include: {
                            products: true,
                        }
                    }
                }
            });
            const products = updated.transactionProducts.map(tp => ({
                product_id: tp.product_id,
                name: tp.name,
                price: tp.price,
                quantity: tp.quantity,
                stock: tp.stock_at_purchase ?? 0,
            }));
            return new transaction_entity_1.Transaction(updated.id, updated.amount, updated.status, updated.base_fee, updated.delivery_fee, products, updated.transaction_id ?? undefined, updated.payment_method_token ?? undefined, updated.createdAt, updated.updatedAt);
        }
        catch (error) {
            return null;
        }
    }
};
exports.PrismaTransactionRepository = PrismaTransactionRepository;
exports.PrismaTransactionRepository = PrismaTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaTransactionRepository);
//# sourceMappingURL=transaction.repository.js.map