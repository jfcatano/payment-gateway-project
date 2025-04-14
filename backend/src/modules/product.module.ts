import { Module } from '@nestjs/common'
import { ProductController } from 'src/interfaces/controllers/product.controller'
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case'
import { GetAllProductsUseCase } from 'src/application/use-cases/get-all-products.use-case'
import { PrismaProductRepository } from 'src/infrastructure/adapters/product.repository'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { PrismaService } from 'src/infrastructure/prisma/prisma.service'

@Module({
  controllers: [ProductController],
  providers: [
    PrismaService,
    CreateProductUseCase,
    GetAllProductsUseCase,
    PrismaProductRepository,
    {
      provide: ProductRepositoryPort,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [ProductRepositoryPort]
})
export class ProductModule {}
