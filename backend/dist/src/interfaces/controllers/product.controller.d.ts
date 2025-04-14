import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { GetAllProductsUseCase } from 'src/application/use-cases/get-all-products.use-case';
export declare class ProductController {
    private readonly createProduct;
    private readonly getAllProducts;
    constructor(createProduct: CreateProductUseCase, getAllProducts: GetAllProductsUseCase);
    create(dto: CreateProductDto): Promise<{
        message: string;
    }>;
    getAll(): Promise<{
        products: import("../../domain/entities/product.entity").Product[];
    }>;
}
