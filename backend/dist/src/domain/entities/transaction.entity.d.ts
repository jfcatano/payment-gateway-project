import { ProductDTO } from "src/interfaces/dtos/product.dto";
export declare class Transaction {
    readonly id: string;
    readonly amount: number;
    readonly status: string;
    readonly base_fee: number;
    readonly delivery_fee: number;
    readonly products: ProductDTO[];
    readonly transaction_id?: string | undefined;
    readonly payment_method_token?: string | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, amount: number, status: string, base_fee: number, delivery_fee: number, products: ProductDTO[], transaction_id?: string | undefined, payment_method_token?: string | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
