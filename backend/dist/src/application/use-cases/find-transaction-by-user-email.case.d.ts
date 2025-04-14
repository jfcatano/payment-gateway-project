import { Result } from 'src/shared/utils/result.util';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { DatabaseError } from 'src/shared/utils/result.util';
export declare class GetTransactionsByUserEmailUseCase {
    private readonly repo;
    constructor(repo: TransactionRepositoryPort);
    execute(email: string): Promise<Result<Transaction[], DatabaseError>>;
}
