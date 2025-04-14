declare class PaymentGatewayTransactionData {
    id: string;
    amount_in_cents: number;
    reference: string;
    customer_email: string;
    currency: string;
    payment_method_type: string;
    redirect_url?: string | null;
    status: string;
    shipping_address?: object | null;
    payment_link_id?: string | null;
    payment_source_id?: number | null;
}
declare class PaymentGatewayEventData {
    transaction: PaymentGatewayTransactionData;
}
declare class PaymentGatewaySignature {
    properties: string[];
    checksum: string;
}
export declare class PaymentGatewayEventDto {
    event: string;
    data: PaymentGatewayEventData;
    environment: string;
    signature: PaymentGatewaySignature;
    timestamp: number;
    sent_at: string;
}
export {};
