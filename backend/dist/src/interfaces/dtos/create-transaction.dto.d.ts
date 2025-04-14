import { CreateCustomerDto } from './create-customer.dto';
import { ProductDTO } from './product.dto';
export declare class CreateTransactionDto {
    transaction_id?: string;
    status?: string;
    amount: number;
    base_fee: number;
    delivery_fee: number;
    payment_method_token?: string;
    error_message?: string;
    productId: string;
    customer: CreateCustomerDto;
    products: ProductDTO[];
}
