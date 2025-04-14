import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'
import { CreateTransactionDto } from 'src/interfaces/dtos/create-transaction.dto'
import { Transaction } from 'src/domain/entities/transaction.entity'
import { ProductDTO } from 'src/interfaces/dtos/product.dto'
import { TransactionStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryPort {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateTransactionDto, tx?: Prisma.TransactionClient): Promise<Transaction> {
    const prismaClient = tx || this.prisma

    const product_id = "703b6065-6118-45f3-8958-601539c88a08"
    const created = await prismaClient.transaction.create({
      data: {
        amount: data.amount,
        base_fee: data.base_fee,
        delivery_fee: data.delivery_fee,
        transaction_id: data.transaction_id,
        payment_method_token: data.payment_method_token,

        customer: {
          connectOrCreate: {
            where: { email: data.customer.email },
            create: {
              name: data.customer.name,
              email: data.customer.email,
              addressLine1: data.customer.addressLine1,
              addressLine2: data.customer.addressLine2,
              city: data.customer.city,
              country: data.customer.country,
            }
          }
        }
      },
    })

    await Promise.all(
      data.products.map(async (product) => {
        return prismaClient.transactionProduct.create({
          data: {
            transaction_id: created.id,
            name: product.name,
            product_id: product.product_id,
            quantity: product.quantity,
            price: product.price,
          }
        })
      }),
    )


    return new Transaction(
      created.id,
      created.amount,
      created.status,
      created.base_fee,
      created.delivery_fee,
      data.products,
      created.transaction_id ?? undefined,
      created.payment_method_token ?? undefined,
      created.createdAt,
      created.updatedAt,
    )
  }

  async findByUserEmail(email: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        customer: {
          email: email,
        },
      },
      include: {
        transactionProducts: {
          include: {
            products: true,
          }
        }
      }
    })

    return transactions.map((transaction) => {
      const products: ProductDTO[] = transaction.transactionProducts.map(tp => ({
        product_id: tp.product_id,
        quantity: tp.quantity,
        name: tp.name,
        price: tp.price,
      }))

      return new Transaction(
        transaction.id,
        transaction.amount,
        transaction.status,
        transaction.base_fee,
        transaction.delivery_fee,
        products,
        transaction.transaction_id ?? undefined,
        transaction.payment_method_token ?? undefined,
        transaction.createdAt,
        transaction.updatedAt,
      )
    })
  }

  async findByReference(reference: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: reference,
      },
      include: {
        transactionProducts: {
          include: {
            products: true,
          }
        }
      }
    })
    
  if (!transaction) return null;

    const products: ProductDTO[] = transaction.transactionProducts.map(tp => ({
      product_id: tp.product_id,
      quantity: tp.quantity,
      name: tp.name,
      price: tp.price,
    }));
  
    return new Transaction(
      transaction.id,
      transaction.amount,
      transaction.status,
      transaction.base_fee,
      transaction.delivery_fee,
      products,
      transaction.transaction_id ?? undefined,
      transaction.payment_method_token ?? undefined,
      transaction.createdAt,
      transaction.updatedAt,
    );
  }

  async updateStatusByReference(
    reference: string,
    status: string,
  ): Promise<Transaction | null> {
    try {
      const transactionStatus = status as TransactionStatus
      const updated = await this.prisma.transaction.update({
        where: { id: reference },
        data: { status: transactionStatus },
        include: {
          transactionProducts: {
            include: {
              products: true,
            }
          }
        }
      })

      // const products = []
      const products: ProductDTO[] = updated.transactionProducts.map(tp => ({
        product_id: tp.product_id,
        name: tp.name,
        price: tp.price,
        quantity: tp.quantity,
        stock: tp.stock_at_purchase ?? 0,
      }));

      return new Transaction(
        updated.id,
        updated.amount,
        updated.status,
        updated.base_fee,
        updated.delivery_fee,
        products,
        updated.transaction_id ?? undefined,
        updated.payment_method_token ?? undefined,
        updated.createdAt,
        updated.updatedAt,
      );
    } catch (error) {
      return null;
    }
  }

}
