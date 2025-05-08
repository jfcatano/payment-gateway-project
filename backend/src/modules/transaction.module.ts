import { Module } from '@nestjs/common'
import { TransactionController } from 'src/interfaces/controllers/transaction.controller'
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case'
import { PrismaProductRepository } from 'src/infrastructure/adapters/product.repository'
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'
import { PrismaTransactionRepository } from 'src/infrastructure/adapters/transaction.repository'
import { GetTransactionsByUserEmailUseCase } from 'src/application/use-cases/find-transaction-by-user-email.use-case'
import { HandlePaymentGatewayEventUseCase } from 'src/application/use-cases/handle-payment-gateway-event.use-case'
import { ConfigModule } from '@nestjs/config'
import { ProductModule } from './product.module'

@Module({
  imports: [
    ConfigModule,
    ProductModule
  ],
  controllers: [TransactionController],
  providers: [
    PrismaService,
    CreateTransactionUseCase,
    GetTransactionsByUserEmailUseCase,
    HandlePaymentGatewayEventUseCase,
    PrismaProductRepository,
    {
      provide: TransactionRepositoryPort,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class TransactionModule { }
