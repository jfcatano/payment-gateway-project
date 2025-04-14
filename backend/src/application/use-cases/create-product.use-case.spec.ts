import { CreateProductUseCase } from './create-product.use-case'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase
  let repo: jest.Mocked<ProductRepositoryPort>

  beforeEach(() => {
    repo = {
      create: jest.fn()
    } as any

    useCase = new CreateProductUseCase(repo)
  })

  it('should return an error if the price is invalid', async () => {
    const dto: CreateProductDto = {
      name: 'test',
      description: 'testing products',
      price: 0,
      stock: 10
    }

    const result = await useCase.execute(dto)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error.message).toBe('Precio o stock inválido')
    }
  })

  it('should return an error if the stock is invalid', async () => {
    const dto: CreateProductDto = {
      name: 'test',
      description: 'testing products',
      price: 10,
      stock: -1
    }

    const result = await useCase.execute(dto)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error.message).toBe('Precio o stock inválido')
    }
  })

  it('should create the product if the data is valid', async () => {
    const dto: CreateProductDto = {
      name: 'test',
      description: 'testing products',
      price: 1000,
      stock: 5
    }

    repo.create.mockResolvedValue(undefined)

    const result = await useCase.execute(dto)

    expect(repo.create).toHaveBeenCalledWith(dto)
    expect(result.isOk()).toBe(true)
  })

  it('should return an error if the repository throws an error', async () => {
    const dto: CreateProductDto = {
      name: 'test',
      description: 'testing products',
      price: 1000,
      stock: 5
    }

    repo.create.mockRejectedValue(new Error('DB error'))

    const result = await useCase.execute(dto)

    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error.message).toBe('Error creando producto')
    }
  })
})
