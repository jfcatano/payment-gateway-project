import { Controller, Post, Body, Get, Param, Logger } from "@nestjs/common";
import { CreateTransactionUseCase } from "../../application/use-cases/create-transaction.use-case";
import { CreateTransactionDto } from "../dtos/create-transaction.dto";
import { GetTransactionsByUserEmailUseCase } from "src/application/use-cases/find-transaction-by-user-email.use-case";
import { HandlePaymentGatewayEventUseCase } from "src/application/use-cases/handle-payment-gateway-event.use-case";

@Controller('transactions')
export class TransactionController {

    private readonly logger = new Logger(TransactionController.name);

    constructor(
        private readonly createTransaction: CreateTransactionUseCase,
        private readonly findTransactionByUserEmail: GetTransactionsByUserEmailUseCase,
        private readonly handlePaymentGatewayEvent: HandlePaymentGatewayEventUseCase,
    ) { }

    @Post()
    async create(@Body() dto: CreateTransactionDto) {
        const result = await this.createTransaction.execute(dto)

        if (result.isErr()) throw new Error(result.error.message)
        return { success: true, message: 'Transaction created', transaction_data: result.value };
    }

    @Get(':email')
    async getTransactionsByUserEmail(@Param('email') email: string) {
        const result = await this.findTransactionByUserEmail.execute(email)
        if (result.isErr()) throw new Error(result.error.message)
        return { data: result.value }
    }

    @Post('payment_gateway/events')
    async handlePaymentGatewayEvents(@Body() eventDto: any) {

        try {
            await this.handlePaymentGatewayEvent.execute(eventDto);
            this.logger.log(`Payment Gateway event ${eventDto.event} processed successfully for ref ${eventDto.data?.transaction?.reference}`);
        } catch (error) {

        }
        return { message: 'Event received' };
    }
}