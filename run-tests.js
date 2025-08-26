import { supabase } from '/src/integrations/supabase/client';

// Test 1: Payment Status Endpoint (should return not_found for non-existent payment)
console.log('🧪 TEST 1: Payment Status - Non-existent Payment');
try {
  const response = await fetch('https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/payment-status?order_id=order_TEST987654321', {
    method: 'GET',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0'
    }
  });
  
  console.log(`Status: ${response.status}`);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Test 1 failed:', error);
}

// Test 2: Reconcile Payment Health Check
console.log('\n🧪 TEST 2: Reconcile Payment Health Check');
try {
  const response = await fetch('https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/reconcile-payment', {
    method: 'GET',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0'
    }
  });
  
  console.log(`Status: ${response.status}`);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Test 2 failed:', error);
}

// Test 3: Manual Verify Payment (will fail due to invalid order ID but should show proper error handling)
console.log('\n🧪 TEST 3: Manual Verify Payment (Backward Compatibility)');
try {
  const response = await fetch('https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment', {
    method: 'POST',
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      razorpay_order_id: 'order_TEST987654321',
      booking: {
        email: 'test@peace2hearts.com',
        scheduled_at: '2024-01-15T10:00:00Z',
        clientName: 'Test User'
      }
    })
  });
  
  console.log(`Status: ${response.status}`);
  const data = await response.json();
  console.log('Response:', JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Test 3 failed:', error);
}

console.log('\n✅ All tests completed');