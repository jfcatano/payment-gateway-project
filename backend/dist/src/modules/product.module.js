"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_controller_1 = require("../interfaces/controllers/product.controller");
const create_product_use_case_1 = require("../application/use-cases/create-product.use-case");
const get_all_products_use_case_1 = require("../application/use-cases/get-all-products.use-case");
const product_repository_1 = require("../infrastructure/adapters/product.repository");
const product_repository_port_1 = require("../domain/ports/product.repository.port");
const prisma_service_1 = require("../infrastructure/prisma/prisma.service");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductController],
        providers: [
            prisma_service_1.PrismaService,
            create_product_use_case_1.CreateProductUseCase,
            get_all_products_use_case_1.GetAllProductsUseCase,
            product_repository_1.PrismaProductRepository,
            {
                provide: product_repository_port_1.ProductRepositoryPort,
                useClass: product_repository_1.PrismaProductRepository,
            },
        ],
        exports: [product_repository_port_1.ProductRepositoryPort]
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map