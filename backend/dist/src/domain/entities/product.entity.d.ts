export interface ProductEntity {
    id: string;
    internalRef: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Product {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly stock: number;
    readonly imageUrl?: string | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, description: string, price: number, stock: number, imageUrl?: string | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
