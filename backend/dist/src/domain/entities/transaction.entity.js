"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    id;
    amount;
    status;
    base_fee;
    delivery_fee;
    products;
    transaction_id;
    payment_method_token;
    createdAt;
    updatedAt;
    constructor(id, amount, status, base_fee, delivery_fee, products, transaction_id, payment_method_token, createdAt, updatedAt) {
        this.id = id;
        this.amount = amount;
        this.status = status;
        this.base_fee = base_fee;
        this.delivery_fee = delivery_fee;
        this.products = products;
        this.transaction_id = transaction_id;
        this.payment_method_token = payment_method_token;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map