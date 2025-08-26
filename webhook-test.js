// Direct webhook test payload for Peace2Hearts
const testWebhookPayload = {
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

// Test manual verification payload (backward compatibility)
const testManualPayload = {
  "razorpay_order_id": "order_TEST987654321",
  "booking": {
    "email": "test@peace2hearts.com",
    "scheduled_at": "2024-01-15T10:00:00Z",
    "clientName": "Test User",
    "consultationType": "Mental Health Counselling"
  }
};

export { testWebhookPayload, testManualPayload };