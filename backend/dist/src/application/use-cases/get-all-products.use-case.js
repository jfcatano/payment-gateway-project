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
exports.GetAllProductsUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_util_1 = require("../../shared/utils/result.util");
const product_repository_port_1 = require("../../domain/ports/product.repository.port");
let GetAllProductsUseCase = class GetAllProductsUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute() {
        try {
            const products = await this.repo.findAll();
            return (0, result_util_1.ok)(products);
        }
        catch (error) {
            return (0, result_util_1.err)(new Error('Error obteniendo productos'));
        }
    }
};
exports.GetAllProductsUseCase = GetAllProductsUseCase;
exports.GetAllProductsUseCase = GetAllProductsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_port_1.ProductRepositoryPort])
], GetAllProductsUseCase);
//# sourceMappingURL=get-all-products.use-case.js.map