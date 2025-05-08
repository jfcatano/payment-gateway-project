import { Test, TestingModule } from '@nestjs/testing'
import { TransactionController } from './transaction.controller'
import { CreateTransactionUseCase } from 'src/application/use-cases/create-transaction.use-case'
import { GetTransactionsByUserEmailUseCase } from 'src/application/use-cases/find-transaction-by-user-email.use-case'
import { HandlePaymentGatewayEventUseCase } from 'src/application/use-cases/handle-payment-gateway-event.use-case'
import { ok, err, okAsync, AppError, errAsync, DatabaseError } from 'src/shared/utils/result.util'
import { Transaction } from 'src/domain/entities/transaction.entity'

describe('TransactionController', () => {
    let controller: TransactionController
    let createTransaction: jest.Mocked<CreateTransactionUseCase>
    let findTransactionByUserEmail: jest.Mocked<GetTransactionsByUserEmailUseCase>
    let handlePaymentGatewayEvent: jest.Mocked<HandlePaymentGatewayEventUseCase>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [
                { provide: CreateTransactionUseCase, useValue: { execute: jest.fn() } },
                { provide: GetTransactionsByUserEmailUseCase, useValue: { execute: jest.fn() } },
                { provide: HandlePaymentGatewayEventUseCase, useValue: { execute: jest.fn() } },
            ],
        }).compile()

        controller = module.get(TransactionController)
        createTransaction = module.get(CreateTransactionUseCase)
        findTransactionByUserEmail = module.get(GetTransactionsByUserEmailUseCase)
        handlePaymentGatewayEvent = module.get(HandlePaymentGatewayEventUseCase)
    })

    it('should create a new transaction successfully', async () => {
        const dto = { userEmail: 'test@mail.com' }
        // const transaction = {
        //     amount: 1000,
        //     amount_in_cents: "100000",
        //     base_fee: 500,
        //     currency: "COP",
        //     delivery_fee: 100,
        //     id: 1,
        //     reference: "12345",
        //     signature: "123abc",
        //     status: 'PENDING', ...dto
        // }

        const createTransactionData = {
            signature: '123abc',
            reference: '12345',
            amount_in_cents: '100000',
            currency: 'COP'
        }

        createTransaction.execute.mockResolvedValue(okAsync(createTransactionData))

        const result = await controller.create(dto as any)

        expect(result).toEqual({
            success: true,
            message: 'Transaction created',
            transaction_data: createTransactionData,
        })
        expect(createTransaction.execute).toHaveBeenCalledWith(dto)
    })

    it('should throw an error if transaction creation fails', async () => {
        const creationError = new Error('Error creating transaction') as AppError

        createTransaction.execute.mockResolvedValue(errAsync(creationError));

        await expect(controller.create({} as any)).rejects.toThrow('Error creating transaction')
    })

    it('should return transactions by email', async () => {
        const email = 'user@test.com'

        const mockTransactions: Transaction[] = [
            {
                id: '123',
                amount: 1000,
                status: 'PENDING',
                base_fee: 0,
                delivery_fee: 0,
                products: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]

        findTransactionByUserEmail.execute.mockResolvedValue(ok(mockTransactions))

        const result = await controller.getTransactionsByUserEmail(email)

        expect(result).toEqual({ data: mockTransactions })
        expect(findTransactionByUserEmail.execute).toHaveBeenCalledWith(email)
    })

    it('should throw an error if it fails to search for transactions', async () => {
        findTransactionByUserEmail.execute.mockResolvedValue(err(new DatabaseError('Transaction search failed')))

        await expect(controller.getTransactionsByUserEmail('email')).rejects.toThrow('Transaction search failed')
    })

    it('should process a payment gateway event without throwing an error', async () => {
        const event = {
            event: 'transaction.success',
            data: {
                transaction: { reference: '12345' },
            },
        }

        handlePaymentGatewayEvent.execute.mockResolvedValue(undefined)

        const result = await controller.handlePaymentGatewayEvents(event)

        expect(result).toEqual({ message: 'Event received' })
        expect(handlePaymentGatewayEvent.execute).toHaveBeenCalledWith(event)
    })
})
