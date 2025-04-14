import { Controller, Post, Get, Body } from '@nestjs/common'
import { CreateProductDto } from 'src/interfaces/dtos/create-product.dto'
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case'
import { GetAllProductsUseCase } from 'src/application/use-cases/get-all-products.use-case'

@Controller('products')
export class ProductController {
    constructor(private readonly createProduct: CreateProductUseCase,
        private readonly getAllProducts: GetAllProductsUseCase,
    ) { }

    @Post()
    async create(@Body() dto: CreateProductDto) {
        const result = await this.createProduct.execute(dto)
        if (result.isErr()) throw new Error(result.error.message)
        return { message: 'Product created' }
    }

    @Get()
    async getAll() {
        const result = await this.getAllProducts.execute()
        if (result.isErr()) throw new Error(result.error.message)
        return { products: result.value }
    }
}