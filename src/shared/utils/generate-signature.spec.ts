import { generateTransactionSignature } from './generate-signature';
import { createHash } from 'crypto';

// Mock the environment variable
process.env.PAYMENT_GATEWAY_INTEGRITY_KEY = 'test_integrity_key';

describe('generateTransactionSignature', () => {
  it('should generate the correct SHA-256 signature', () => {
    const input = {
      reference: 'test-ref-123',
      amount_in_cents: 50000, // Example amount
      currency: 'COP',
    };

    const expectedString = `${input.reference}${input.amount_in_cents}${input.currency}${process.env.PAYMENT_GATEWAY_INTEGRITY_KEY}`;
    const expectedSignature = createHash('sha256')
      .update(expectedString)
      .digest('hex');

    const signature = generateTransactionSignature(input);

    expect(signature).toBe(expectedSignature);
  });

  it('should handle different input values', () => {
    const input = {
      reference: 'another-ref-456',
      amount_in_cents: 100,
      currency: 'USD',
    };

    const expectedString = `${input.reference}${input.amount_in_cents}${input.currency}${process.env.PAYMENT_GATEWAY_INTEGRITY_KEY}`;
    const expectedSignature = createHash('sha256')
      .update(expectedString)
      .digest('hex');

    const signature = generateTransactionSignature(input);
    expect(signature).toBe(expectedSignature);
  });
});