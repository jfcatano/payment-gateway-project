import { Result } from 'src/shared/utils/result.util';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto';
export declare class CreateProductUseCase {
    private readonly repo;
    constructor(repo: ProductRepositoryPort);
    execute(dto: CreateProductDto): Promise<Result<void, Error>>;
}
