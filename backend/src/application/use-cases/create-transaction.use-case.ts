import { Injectable, Logger } from '@nestjs/common'
import { ResultAsync, ok, err, DatabaseError, BusinessError, AppError } from 'src/shared/utils/result.util'
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'
import { CreateTransactionDto } from 'src/interfaces/dtos/create-transaction.dto'
import { generateTransactionSignature } from 'src/shared/utils/generate-signature'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'

@Injectable()
export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name)
  
  constructor(
    private readonly repo: TransactionRepositoryPort,
    private readonly productRepo: ProductRepositoryPort,
    private readonly prismaService: PrismaService
  ) {}

  async execute(dto: CreateTransactionDto): Promise<
    ResultAsync<{
      signature: string
      reference: string
      amount_in_cents: string
      currency: string
    }, AppError>
  > {
    this.logger.log(`Starting execution for the customer: ${dto.customer.email}`)

    return ResultAsync.fromPromise(
      this.prismaService.executeTransaction(async (tx) => {
        this.logger.log(`In the DB transaction.`)

        for (const item of dto.products) {
          this.logger.log(`Decrementando stock para producto ${item.product_id} (cantidad: ${item.quantity})...`)
          const success = await this.productRepo.decreaseStock(item.product_id, item.quantity, tx)
          
          // if (!success) {
          //   throw new BusinessError(`No hay stock suficiente para el producto ${item.product_id}`, {
          //     productId: item.product_id,
          //     requestedQuantity: item.quantity,
          //   })
          // }
        }

        this.logger.log(`Creating transaction registry...`)
        const transactionEntity = await this.repo.create(dto, tx)
        return transactionEntity
      }),
      (error) => {
        this.logger.error(`Error in trasaction execution`, error)
        return error instanceof BusinessError
          ? error
          : new DatabaseError('Error creating transaction', { original: error })
      }
    ).map((transactionResult) => {
      const currency = 'COP'
      const amount_in_cents = Math.round(transactionResult.amount * 100).toString()

      const signature = generateTransactionSignature({
        reference: transactionResult.id,
        amount_in_cents: parseInt(amount_in_cents),
        currency,
      })

      return {
        signature,
        reference: transactionResult.id,
        amount_in_cents,
        currency,
      }
    })
  }
}
