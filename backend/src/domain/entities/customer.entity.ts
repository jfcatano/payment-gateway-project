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

export class Customer {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly addressLine1: string,
        public readonly addressLine2?: string,
        public readonly city?: string,
        public readonly country?: string,
        public readonly postalCode?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date,
    ) { }
}