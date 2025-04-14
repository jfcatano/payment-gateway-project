import { Result } from 'src/shared/utils/result.util';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
export declare class GetAllProductsUseCase {
    private readonly repo;
    constructor(repo: ProductRepositoryPort);
    execute(): Promise<Result<Product[], Error>>;
}
