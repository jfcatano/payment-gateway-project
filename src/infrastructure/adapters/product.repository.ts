import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'
import { Product } from 'src/domain/entities/product.entity'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateProductDto): Promise<void> {
    await this.prisma.product.create({ data })
  }

  async findAll(): Promise<Product[]> {
    const result = await this.prisma.product.findMany()

    return result.map((product) => new Product(
      product.id,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.imageUrl ?? undefined,
      product.createdAt,
      product.updatedAt,
    ))
  }

  async decreaseStock(product_id: string, quantity: number, tx?: Prisma.TransactionClient): Promise<void> {
    const prismaClient = tx || this.prisma

    console.log(`[decreaseStock] Searching for product ${product_id}`); // <-- LOG
    const product = await prismaClient.product.findUnique({
      where: { id: product_id },
      select: { stock: true },
    })
    console.log(`[decreaseStock] Product found: ${JSON.stringify(product)}`); // <-- LOG

    if (!product || product.stock < quantity) {
      console.error(`[decreaseStock] Insufficient stock detected for ${product_id}! Required: ${quantity}, Available: ${product?.stock ?? 0}`); // <-- ERROR LOG
      
      throw new Error(`Insuficient stock for product ${product_id}. Required: ${quantity}, available: ${product?.stock}`)
    }

    console.log(`[decreaseStock] Sufficient stock. Trying to update product ${product_id}...`); // <-- LOG

    await prismaClient.product.update({
      where: { id: product_id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
    console.log(`[decreaseStock] Product ${product_id} updated.`); // <-- LOG
  }

  async increaseStock(product_id: string, quantity: number): Promise<void> {
    await this.prisma.product.update({
      where: { id: product_id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }
}
