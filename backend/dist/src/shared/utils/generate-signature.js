"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionSignature = generateTransactionSignature;
const crypto_1 = require("crypto");
function generateTransactionSignature({ reference, amount_in_cents, currency, }) {
    const integrity_key = process.env.PAYMENT_GATEWAY_INTEGRITY_KEY;
    const signatureString = `${reference}${amount_in_cents}${currency}${integrity_key}`;
    console.log('signatureString', signatureString);
    return (0, crypto_1.createHash)('sha256').update(signatureString).digest('hex');
}
//# sourceMappingURL=generate-signature.js.map