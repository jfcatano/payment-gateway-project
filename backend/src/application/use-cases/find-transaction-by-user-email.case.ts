import { Injectable } from '@nestjs/common'
import { Result, ok, err } from 'src/shared/utils/result.util'
import { Transaction } from 'src/domain/entities/transaction.entity'
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'
import { DatabaseError } from 'src/shared/utils/result.util' // <- usando tu clase personalizada

@Injectable()
export class GetTransactionsByUserEmailUseCase {
  constructor(private readonly repo: TransactionRepositoryPort) { }

  async execute(email: string): Promise<Result<Transaction[], DatabaseError>> {
    try {
      const transactions = await this.repo.findByUserEmail(email)
      return ok(transactions)
    } catch (error) {
      return err(
        new DatabaseError('Error fetching transactions by email.', {
          originalError: error,
          email,
        })
      )
    }
  }
}

// import { Injectable } from '@nestjs/common'
// import { Result, ok, err } from 'src/shared/result'
// import { Transaction } from 'src/domain/entities/transaction.entity'
// import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'

// @Injectable()
// export class GetTransactionsByUserEmailUseCase {
//   constructor(private readonly repo: TransactionRepositoryPort) {}

//   async execute(email: string): Promise<Result<Transaction[], Error>> {
//     try {
//       const transactions = await this.repo.findByUserEmail(email)
//       return ok(transactions)
//     } catch (e) {
//       return err(new Error('Error obteniendo productos'))
//     }
//   }
// }