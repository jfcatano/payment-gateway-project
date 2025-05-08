// src/tests/integration/prisma-product-repo.test.ts

import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'
import { PrismaProductRepository } from './product.repository'
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'
import { Product } from 'src/domain/entities/product.entity'

describe('ProductRepositoryPort', () => {
  let repo: PrismaProductRepository
  let prismaMock: jest.Mocked<PrismaService>

  beforeEach(() => {
    prismaMock = {
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      }
    } as any

    repo = new PrismaProductRepository(prismaMock)
  })

  describe('Create Product', () => {
    it('should call prisma.product.create with correct data', async () => {
      const dto: CreateProductDto = {
        name: 'New Product',
        description: 'Product Description',
        price: 100,
        stock: 10,
      }

      await repo.create(dto)

      expect(prismaMock.product.create).toHaveBeenCalledWith({
        data: dto,
      })
    })
  })

  describe('Find All Products', () => {
    it('should return an array of products', async () => {
      (prismaMock.product.findMany as jest.Mock).mockResolvedValue([
        {
          id: '1',
          name: 'Product 1',
          description: 'Desc 1',
          price: 100,
          stock: 10,
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Product 2',
          description: 'Desc 2',
          price: 200,
          stock: 20,
          imageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])      

      // (prismaMock.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

      const result = await repo.findAll()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Product 1')
    })
  })

  describe('Decrease Stock', () => {
    it('should call prisma.product.update with correct data', async () => {
      const productId = '1'
      const quantity = 5;

      (prismaMock.product.findUnique as jest.Mock).mockResolvedValue({ stock: 10 })

      await repo.decreaseStock(productId, quantity)

      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      })
    })

    it('should throw an error if stock is insufficient', async () => {
      const productId = '1'
      const quantity = 15;

      (prismaMock.product.findUnique as jest.Mock).mockResolvedValue({ stock: 10 })

      await expect(repo.decreaseStock(productId, quantity)).rejects.toThrowError(`Insuficient stock for product ${productId}. Required: ${quantity}, available: 10`)
    })
  })

  describe('Increase Stock', () => {
    it('should call prisma.product.update with correct data', async () => {
      const productId = '1'
      const quantity = 5;

      await repo.increaseStock(productId, quantity)

      expect(prismaMock.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: { stock: { increment: quantity } },
      })
    })
  })
  
})
