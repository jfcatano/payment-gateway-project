import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';

// Class for the transaction within the event
class PaymentGatewayTransactionData {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  amount_in_cents: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  customer_email: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  payment_method_type: string;

  @IsString()
  @IsOptional()
  redirect_url?: string | null;

  @IsString()
  @IsNotEmpty()
  @IsIn(['APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'])
  status: string;

  @IsObject()
  @IsOptional()
  shipping_address?: object | null;

  @IsString()
  @IsOptional()
  payment_link_id?: string | null;

  @IsNumber()
  @IsOptional()
  payment_source_id?: number | null;
}

// Class for the 'data' structure of the event
class PaymentGatewayEventData {
  @ValidateNested()
  @Type(() => PaymentGatewayTransactionData)
  @IsObject()
  @IsNotEmpty()
  transaction: PaymentGatewayTransactionData;
}

// Class for the signature of the event
class PaymentGatewaySignature {
  @IsArray()
  @IsString({ each: true })
  properties: string[];

  @IsString()
  @IsNotEmpty()
  checksum: string;
}

// Main DTO for the PaymentGateway event
export class PaymentGatewayEventDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['transaction.updated', 'nequi_token.updated', 'bancolombia_transfer_token.updated'])
  event: string;

  @ValidateNested()
  @Type(() => PaymentGatewayEventData)
  @IsObject()
  @IsNotEmpty()
  data: PaymentGatewayEventData;

  @IsString()
  @IsNotEmpty()
  @IsIn(['test', 'prod'])
  environment: string;

  @ValidateNested()
  @Type(() => PaymentGatewaySignature)
  @IsObject()
  @IsNotEmpty()
  signature: PaymentGatewaySignature;

  @IsNumber()
  timestamp: number; // Timestamp (UNIX)

  @IsString()
  @IsNotEmpty()
  sent_at: string; // Date (ISO 8601)
}
