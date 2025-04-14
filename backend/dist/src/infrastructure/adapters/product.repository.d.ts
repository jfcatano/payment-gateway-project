import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto';
import { Product } from 'src/domain/entities/product.entity';
import { Prisma } from '@prisma/client';
export declare class PrismaProductRepository implements ProductRepositoryPort {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateProductDto): Promise<void>;
    findAll(): Promise<Product[]>;
    decreaseStock(product_id: string, quantity: number, tx?: Prisma.TransactionClient): Promise<void>;
    increaseStock(product_id: string, quantity: number): Promise<void>;
}
