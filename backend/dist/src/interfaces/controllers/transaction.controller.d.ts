import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case";
import { CreateTransactionDto } from "../dtos/create-transaction.dto";
import { GetTransactionsByUserEmailUseCase } from "src/application/use-cases/find-transaction-by-user-email.case";
import { HandlePaymentGatewayEventUseCase } from "src/application/use-cases/handle-payment-gateway-event.use-case";
export declare class TransactionController {
    private readonly createTransaction;
    private readonly findTransactionByUserEmail;
    private readonly handlePaymentGatewayEvent;
    private readonly logger;
    constructor(createTransaction: CreateTransactionUseCase, findTransactionByUserEmail: GetTransactionsByUserEmailUseCase, handlePaymentGatewayEvent: HandlePaymentGatewayEventUseCase);
    create(dto: CreateTransactionDto): Promise<{
        success: boolean;
        message: string;
        transaction_data: {
            signature: string;
            reference: string;
            amount_in_cents: string;
            currency: string;
        };
    }>;
    getTransactionsByUserEmail(email: string): Promise<{
        data: import("../../domain/entities/transaction.entity").Transaction[];
    }>;
    handlePaymentGatewayEvents(eventDto: any): Promise<{
        message: string;
    }>;
}
