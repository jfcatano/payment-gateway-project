import crypto from 'crypto';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

dotenv.config(); // Load environment variables from .env file

const generateSignature = async (amount) => {

    const PAYMENT_GATEWAY_INTEGRITY_KEY = process.env.PAYMENT_GATEWAY_INTEGRITY_KEY; // Get the integrity key from environment variables

    const internal_ref = uuidv4(); // Generate a unique internal reference
    const timestamp = Date.now(); // Get the current timestamp

    const amount_in_cents = amount * 100; // Convert amount to cents

    // const concatenated_string = `${internal_ref}${amount_in_cents}COP${timestamp}${PAYMENT_GATEWAY_INTEGRITY_KEY}`; // Concatenate the string
    const concatenated_string = `${internal_ref}${amount_in_cents}COP${PAYMENT_GATEWAY_INTEGRITY_KEY}`; // Concatenate the string

    const encodedText = new TextEncoder().encode(concatenated_string); // Encode the string
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText); // Create a SHA-256 hash
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert the hash to an array of bytes
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // "37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5"


    return {
        Hash: hashHex,
        concatenacion: concatenated_string,
        timestamp: timestamp,
        internal_ref: internal_ref,
        amount_in_cents: amount_in_cents,
        amount: amount,
    };
}

const result = await generateSignature(10000); // Call the function with an amount of 1000
console.log(result)