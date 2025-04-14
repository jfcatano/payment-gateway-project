import { createHash } from 'crypto';

export function generateTransactionSignature({
    reference,
    amount_in_cents,
    currency,
}: {
    reference: string;
    amount_in_cents: number;
    currency: string;
}): string {
    const integrity_key = process.env.PAYMENT_GATEWAY_INTEGRITY_KEY;

    const signatureString = `${reference}${amount_in_cents}${currency}${integrity_key}`;
    console.log('signatureString', signatureString);
    return createHash('sha256').update(signatureString).digest('hex');
}
