import { Injectable } from '@nestjs/common'
import { Result, ok, err } from 'src/shared/utils/result.util'
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port'
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly repo: ProductRepositoryPort) { }

  async execute(dto: CreateProductDto): Promise<Result<void, Error>> {
    if (dto.price <= 0 || dto.stock < 0) {
      return err(new Error('Price or invalid stock'))
    }

    try {
      await this.repo.create(dto)
      return ok(undefined)
    } catch (error) {
      return err(new Error('Error creating product'))
    }
  }
}
