import { Test, TestingModule } from '@nestjs/testing'
import { ProductController } from './product.controller'
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case'
import { GetAllProductsUseCase } from 'src/application/use-cases/get-all-products.use-case'
import { ok, err } from 'src/shared/utils/result.util'

describe('ProductController', () => {
  let controller: ProductController
  let createProduct: jest.Mocked<CreateProductUseCase>
  let getAllProducts: jest.Mocked<GetAllProductsUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: CreateProductUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetAllProductsUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile()

    controller = module.get<ProductController>(ProductController)
    createProduct = module.get(CreateProductUseCase)
    getAllProducts = module.get(GetAllProductsUseCase)
  })

  it('debería crear un producto exitosamente', async () => {
    createProduct.execute.mockResolvedValue(ok(undefined))

    const dto = { name: 'Test', price: 10_000 }
    const response = await controller.create(dto as any)

    expect(response).toEqual({ message: 'Product created' })
    expect(createProduct.execute).toHaveBeenCalledWith(dto)
  })

  it('debería lanzar error si falla al crear un producto', async () => {
    createProduct.execute.mockResolvedValue(err(new Error('fallo de lógica')))

    await expect(controller.create({} as any)).rejects.toThrow('fallo de lógica')
  })

  it('debería retornar productos exitosamente', async () => {
    const products = [{ id: '1', name: 'P1', description: 'Product description', price: 10000, stock: 10 }, { id: '1', name: 'P1', description: 'Product description', price: 15000, stock: 15 }]
    getAllProducts.execute.mockResolvedValue(ok(products))

    const response = await controller.getAll()

    expect(response).toEqual({ products })
  })

  it('debería lanzar error si falla al obtener productos', async () => {
    getAllProducts.execute.mockResolvedValue(err(new Error('fallo al obtener productos')))

    await expect(controller.getAll()).rejects.toThrow('fallo al obtener productos')
  })
})
