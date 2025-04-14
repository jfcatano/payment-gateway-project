"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    id;
    name;
    email;
    addressLine1;
    addressLine2;
    city;
    country;
    postalCode;
    createdAt;
    updatedAt;
    constructor(id, name, email, addressLine1, addressLine2, city, country, postalCode, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map