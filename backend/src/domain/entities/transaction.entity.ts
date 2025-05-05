import { ProductDTO } from "src/interfaces/dtos/product.dto";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly status: string,
    public readonly base_fee: number,
    public readonly delivery_fee: number,
    public readonly products: ProductDTO[],
    public readonly transaction_id?: string,
    public readonly payment_method_token?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
