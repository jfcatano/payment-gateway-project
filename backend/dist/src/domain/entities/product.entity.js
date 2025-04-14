"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    id;
    name;
    description;
    price;
    stock;
    imageUrl;
    createdAt;
    updatedAt;
    constructor(id, name, description, price, stock, imageUrl, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map