import { ConfigService } from '@nestjs/config';
import { TransactionRepositoryPort } from '../../domain/ports/transaction.repository.port';
import { PaymentGatewayEventDto } from 'src/interfaces/dtos/paymentgateway-event-dto';
import { ProductRepositoryPort } from 'src/domain/ports/product.repository.port';
export declare class HandlePaymentGatewayEventUseCase {
    private readonly transactionRepository;
    private readonly configService;
    private readonly productRepository;
    private readonly logger;
    private readonly paymentGatewayEventsSecret;
    constructor(transactionRepository: TransactionRepositoryPort, configService: ConfigService, productRepository: ProductRepositoryPort);
    private getNestedValue;
    private validateSignature;
    execute(eventDto: PaymentGatewayEventDto): Promise<void>;
    private mapGatewayStatusToTransactionStatus;
}
