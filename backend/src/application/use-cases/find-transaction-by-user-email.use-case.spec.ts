import { Transaction } from 'src/domain/entities/transaction.entity'
import { GetTransactionsByUserEmailUseCase } from './find-transaction-by-user-email.use-case'
import { TransactionRepositoryPort } from 'src/domain/ports/transaction.repository.port'
import { ok, err } from 'src/shared/utils/result.util'

describe('GetTransactionsByUserEmail', () => {
    const mockRepo: jest.Mocked<TransactionRepositoryPort> = {
        create: jest.fn(),
        findByUserEmail: jest.fn(),
        findByReference: jest.fn(),
        updateStatusByReference: jest.fn(),
    }

    const useCase = new GetTransactionsByUserEmailUseCase(mockRepo)

    it('should return transactions when the repository responds correctly', async () => {
        // id, amount, status, base_fee, delivery_fee, products
        const transactions: Transaction[] = [
            new Transaction(
                'uuid-v4', // id
                10000, // amount
                'PENDING', // status
                500, // base_fee
                1500, // delivery_fee
                [
                    { product_id: '1', name: 'Producto 1', price: 5000, quantity: 1 },
                    { product_id: '2', name: 'Producto 2', price: 5000, quantity: 1 },
                ] // products
            )
        ]

        mockRepo.findByUserEmail.mockResolvedValue(transactions)

        const result = await useCase.execute('user@gmail.com')

        expect(result).toEqual(ok(transactions))
        expect(mockRepo.findByUserEmail).toHaveBeenCalledTimes(1)
    })

    it('should return error when the repository throws an exception', async () => {
        mockRepo.findByUserEmail.mockRejectedValue(new Error('DB error'))

        const result = await useCase.execute('user@gmail.com')

        expect(result.isErr()).toBe(true)
        if (result.isErr()) {
            expect(result.error.message).toBe('Error fetching transactions by email.')
        }

    })

})
