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
exports.PrismaProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const product_entity_1 = require("../../domain/entities/product.entity");
let PrismaProductRepository = class PrismaProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        await this.prisma.product.create({ data });
    }
    async findAll() {
        const result = await this.prisma.product.findMany();
        return result.map((product) => new product_entity_1.Product(product.id, product.name, product.description, product.price, product.stock, product.imageUrl ?? undefined, product.createdAt, product.updatedAt));
    }
    async decreaseStock(product_id, quantity, tx) {
        const prismaClient = tx || this.prisma;
        console.log(`[decreaseStock] Searching for product ${product_id}`);
        const product = await prismaClient.product.findUnique({
            where: { id: product_id },
            select: { stock: true },
        });
        console.log(`[decreaseStock] Product found: ${JSON.stringify(product)}`);
        if (!product || product.stock < quantity) {
            console.error(`[decreaseStock] Insufficient stock detected for ${product_id}! Required: ${quantity}, Available: ${product?.stock ?? 0}`);
            throw new Error(`Insuficient stock for product ${product_id}. Required: ${quantity}, available: ${product?.stock}`);
        }
        console.log(`[decreaseStock] Sufficient stock. Trying to update product ${product_id}...`);
        await prismaClient.product.update({
            where: { id: product_id },
            data: {
                stock: {
                    decrement: quantity,
                },
            },
        });
        console.log(`[decreaseStock] Product ${product_id} updated.`);
    }
    async increaseStock(product_id, quantity) {
        await this.prisma.product.update({
            where: { id: product_id },
            data: {
                stock: {
                    increment: quantity,
                },
            },
        });
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaProductRepository);
//# sourceMappingURL=product.repository.js.map