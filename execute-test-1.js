// TEST 1: Payment Status Endpoint
// Testing GET request to payment-status endpoint

const testUrl = 'https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/payment-status?order_id=order_TEST987654321';

fetch(testUrl, {
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0'
  }
})
.then(response => {
  console.log('🧪 TEST 1 RESULTS - Payment Status Endpoint');
  console.log('Status Code:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Headers:', [...response.headers.entries()]);
  return response.json();
})
.then(data => {
  console.log('Response Body:', JSON.stringify(data, null, 2));
  console.log('✅ Test 1 completed\n');
})
.catch(error => {
  console.error('❌ Test 1 failed:', error);
});