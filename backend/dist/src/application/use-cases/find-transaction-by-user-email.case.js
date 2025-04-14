"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionsByUserEmailUseCase = void 0;
const common_1 = require("@nestjs/common");
const result_util_1 = require("../../shared/utils/result.util");
const transaction_repository_port_1 = require("../../domain/ports/transaction.repository.port");
const result_util_2 = require("../../shared/utils/result.util");
let GetTransactionsByUserEmailUseCase = class GetTransactionsByUserEmailUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(email) {
        try {
            const transactions = await this.repo.findByUserEmail(email);
            return (0, result_util_1.ok)(transactions);
        }
        catch (error) {
            return (0, result_util_1.err)(new result_util_2.DatabaseError('Error fetching transactions by email.', {
                originalError: error,
                email,
            }));
        }
    }
};
exports.GetTransactionsByUserEmailUseCase = GetTransactionsByUserEmailUseCase;
exports.GetTransactionsByUserEmailUseCase = GetTransactionsByUserEmailUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_port_1.TransactionRepositoryPort])
], GetTransactionsByUserEmailUseCase);
//# sourceMappingURL=find-transaction-by-user-email.case.js.map