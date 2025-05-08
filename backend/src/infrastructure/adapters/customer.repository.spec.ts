import { CustomerPrismaRepository } from './customer.repository'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'
import { CreateCustomerDto } from 'src/interfaces/dtos/create-customer.dto'
import { Customer } from 'src/domain/entities/customer.entity'

describe('CustomerPrismaRepository', () => {
  let repo: CustomerPrismaRepository
  let prismaMock: jest.Mocked<PrismaService>

  beforeEach(() => {
    prismaMock = {
      customer: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as any

    repo = new CustomerPrismaRepository(prismaMock)
  })

  describe('findByEmail', () => {
    it('debería retornar un Customer cuando existe en la base de datos', async () => {
        (prismaMock.customer.findUnique as jest.Mock).mockResolvedValue({
            id: '1',
            name: 'Juan',
            email: 'juan@test.com',
            addressLine1: 'Calle falsa 123',
          })

      const result = await repo.findByEmail('juan@test.com')

      expect(result).toBeInstanceOf(Customer)
      expect(result?.email).toBe('juan@test.com')
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { email: 'juan@test.com' },
      })
    })

    it('debería retornar null si no se encuentra el customer', async () => {
      (prismaMock.customer.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await repo.findByEmail('noexiste@test.com')

      expect(result).toBeNull()
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { email: 'noexiste@test.com' },
      })
    })
  })

  describe('create', () => {
    it('debería llamar a prisma.customer.create con los datos correctos', async () => {
      const dto: CreateCustomerDto = {
        name: 'Nuevo Cliente',
        email: 'nuevo@cliente.com',
        city: 'Medellín',
        country: 'Colombia',
        addressLine1: 'Calle Nueva 456',
      }

      await repo.create(dto)

      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: dto,
      })
    })
  })
})
