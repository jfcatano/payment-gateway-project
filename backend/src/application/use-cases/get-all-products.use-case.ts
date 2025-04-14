import { Injectable } from '@nestjs/common'
import { Result, ok, err } from 'src/shared/utils/result.util'
import { Product } from 'src/domain/entities/product.entity'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly repo: ProductRepositoryPort) { }

  async execute(): Promise<Result<Product[], Error>> {
    try {
      const products = await this.repo.findAll()
      return ok(products)
    } catch (error) {
      return err(new Error('Error obteniendo productos'))
    }
  }
}