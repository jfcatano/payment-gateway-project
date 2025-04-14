import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'
import { Product } from 'src/domain/entities/product.entity'

export abstract class ProductRepositoryPort {
  abstract create(data: CreateProductDto): Promise<void>
  abstract findAll(): Promise<Product[]>
  abstract decreaseStock(product_id: string, quantity: number, tx): Promise<void>
  abstract increaseStock(product_id: string, quantity: number): Promise<void>
}
