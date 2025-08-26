// TEST 3: Manual Verify Payment (Backward Compatibility)
// Testing POST request to verify-payment endpoint without webhook signature

const verifyUrl = 'https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment';

const testPayload = {
  razorpay_order_id: 'order_TEST987654321',
  booking: {
    email: 'test@peace2hearts.com',
    scheduled_at: '2024-01-15T10:00:00Z',
    clientName: 'Test User',
    consultationType: 'Mental Health Counselling'
  }
};

fetch(verifyUrl, {
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
    'Content-Type': 'application/json'
    // Note: No X-Razorpay-Signature header = manual mode
  },
  body: JSON.stringify(testPayload)
})
.then(response => {
  console.log('🧪 TEST 3 RESULTS - Manual Verify Payment');
  console.log('Status Code:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', [...response.headers.entries()]);
  return response.json();
})
.then(data => {
  console.log('Response Body:', JSON.stringify(data, null, 2));
  console.log('Expected: Should show deprecation warning in logs');
  console.log('Expected: Should fail with "Payment not found or failed" since test order doesn\'t exist');
  console.log('✅ Test 3 completed\n');
})
.catch(error => {
  console.error('❌ Test 3 failed:', error);
});