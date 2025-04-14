import { Type } from 'class-transformer'
import { IsString, IsNumber, Min, ValidateNested, IsOptional, IsNotEmpty } from 'class-validator'
import { CreateCustomerDto } from './create-customer.dto'
import { ProductDTO } from './product.dto'

export class CreateTransactionDto {

  @IsOptional()
  transaction_id?: string // Payment Gateway transaction ID
  
  @IsOptional()
  status?: string // Transaciton Status (PENDING, APPROVED, REJECTED)
  
  @IsOptional()
  amount: number // Total amount paid

  @IsOptional()
  base_fee: number // Base fee
  
  @IsOptional()
  delivery_fee: number // Delivery fee
  
  @IsOptional()
  payment_method_token?: string // Payment method reference
 
  @IsOptional()
  error_message?: string // Error message if any error occurs
  
  @IsOptional()
  productId: string // Product ID

  @ValidateNested()
  @Type(() => CreateCustomerDto)
  @IsNotEmpty()
  customer: CreateCustomerDto

  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products: ProductDTO[] // Products array
}

// export enum TransactionStatus {
//   PENDING = 'PENDING',
//   APPROVED = 'APPROVED',
//   DECLINED = 'DECLINED',
//   ERROR = 'ERROR',
// }