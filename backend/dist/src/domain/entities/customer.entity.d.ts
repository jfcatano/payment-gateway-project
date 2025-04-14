export interface CustomerEntity {
    id: string;
    name: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Customer {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly addressLine1: string;
    readonly addressLine2?: string | undefined;
    readonly city?: string | undefined;
    readonly country?: string | undefined;
    readonly postalCode?: string | undefined;
    readonly createdAt?: Date | undefined;
    readonly updatedAt?: Date | undefined;
    constructor(id: string, name: string, email: string, addressLine1: string, addressLine2?: string | undefined, city?: string | undefined, country?: string | undefined, postalCode?: string | undefined, createdAt?: Date | undefined, updatedAt?: Date | undefined);
}
