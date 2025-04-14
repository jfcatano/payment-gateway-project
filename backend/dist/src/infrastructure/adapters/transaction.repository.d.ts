import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port';
import { CreateTransactionDto } from 'src/interfaces/dtos/create-transaction.dto';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { Prisma } from '@prisma/client';
export declare class PrismaTransactionRepository implements TransactionRepositoryPort {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateTransactionDto, tx?: Prisma.TransactionClient): Promise<Transaction>;
    findByUserEmail(email: string): Promise<Transaction[]>;
    findByReference(reference: string): Promise<Transaction | null>;
    updateStatusByReference(reference: string, status: string): Promise<Transaction | null>;
}
