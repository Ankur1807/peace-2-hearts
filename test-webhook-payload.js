// Webhook simulation script for testing
import { createHash, createHmac } from 'crypto';

// Test webhook payload
const webhookPayload = {
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_TEST123456789",
        "entity": "payment",
        "amount": 50000,
        "currency": "INR",
        "status": "captured",
        "order_id": "order_TEST987654321",
        "method": "netbanking",
        "email": "test@peace2hearts.com",
        "contact": "+919876543210",
        "notes": {
          "service": "Mental Health Counselling",
          "reference": "P2H-TEST-001"
        },
        "created_at": 1703097600
      }
    }
  }
};

// Generate HMAC signature (we'll need the webhook secret from environment)
const payloadString = JSON.stringify(webhookPayload);
console.log('Test webhook payload:', payloadString);

// This would be used with the actual RZP_WEBHOOK_SECRET
// const signature = createHmac('sha256', process.env.RZP_WEBHOOK_SECRET).update(payloadString).digest('hex');
// console.log('Expected signature:', signature);

export { webhookPayload, payloadString };