import { ResultAsync, AppError } from 'src/shared/utils/result.util';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { CreateTransactionDto } from 'src/interfaces/dtos/create-transaction.dto';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
export declare class CreateTransactionUseCase {
    private readonly repo;
    private readonly productRepo;
    private readonly prismaService;
    private readonly logger;
    constructor(repo: TransactionRepositoryPort, productRepo: ProductRepositoryPort, prismaService: PrismaService);
    execute(dto: CreateTransactionDto): Promise<ResultAsync<{
        signature: string;
        reference: string;
        amount_in_cents: string;
        currency: string;
    }, AppError>>;
}
