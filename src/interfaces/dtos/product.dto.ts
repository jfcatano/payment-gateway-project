import { IsString, IsNumber, IsUUID, IsInt, IsOptional } from 'class-validator'

export class ProductDTO {
    @IsUUID()
    product_id: string;
  
    @IsString()
    name: string;
  
    @IsNumber()
    price: number;
  
    @IsInt()
    quantity: number;
  
  }
  