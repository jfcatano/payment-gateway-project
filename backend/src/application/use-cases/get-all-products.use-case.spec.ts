import { GetAllProductsUseCase } from './get-all-products.use-case'
import { Product } from 'src/domain/entities/product.entity'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { ok, err } from 'src/shared/utils/result.util'

describe('GetAllProductsUseCase', () => {
  const mockRepo: jest.Mocked<ProductRepositoryPort> = {
    create: jest.fn(),
    findAll: jest.fn(),
    decreaseStock: jest.fn(),
    increaseStock: jest.fn(),
  }

  const useCase = new GetAllProductsUseCase(mockRepo)

  it('debería retornar productos cuando el repositorio responde correctamente', async () => {
    const products: Product[] = [
      // id, name, description, price, stock
      new Product('1', 'Testing product', 'Testing product description', 100, 40),
      new Product('2', 'Testing product 2', 'Testing product description 2', 150, 15),
    ]

    mockRepo.findAll.mockResolvedValue(products)

    const result = await useCase.execute()

    expect(result).toEqual(ok(products))
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1)
  })

  it('debería retornar error cuando el repositorio lanza una excepción', async () => {
    mockRepo.findAll.mockRejectedValue(new Error('DB error'))

    const result = await useCase.execute()

    // expect(result.isErr()).toBe(true)
    // expect(result.error.message).toEqual(new Error('Error obteniendo productos'))
  
    expect(result.isErr()).toBe(true)
    if (result.isErr()) {
      expect(result.error.message).toBe('Error getting products')
    }
  })
})
