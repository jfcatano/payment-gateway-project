import { CreateTransactionDto } from 'src/interfaces/dtos/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
export declare abstract class TransactionRepositoryPort {
    abstract create(data: CreateTransactionDto, tx: any): Promise<Transaction>;
    abstract findByUserEmail(email: string): Promise<Transaction[]>;
    abstract findByReference(reference: string): Promise<Transaction | null>;
    abstract updateStatusByReference(reference: string, status: string): Promise<Transaction | null>;
}
