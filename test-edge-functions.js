// Test script for Peace2Hearts edge functions
import { createClient } from '@supabase/supabase-js';

// Test data
const testPaymentId = 'pay_TEST123456789';
const testOrderId = 'order_TEST987654321';

// Test payment-status endpoint
async function testPaymentStatus() {
  console.log('🔍 Testing payment-status endpoint...');
  
  const response = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/payment-status?order_id=${testOrderId}`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Status:', response.status);
  console.log('Response:', await response.json());
}

// Test reconcile-payment endpoint  
async function testReconcilePayment() {
  console.log('🔧 Testing reconcile-payment endpoint...');
  
  const response = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/reconcile-payment`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
      'Content-Type': 'application/json',
      'X-Admin-Token': 'test-token' // This will need to be the real token
    },
    body: JSON.stringify({
      razorpay_order_id: testOrderId,
      booking: {
        email: 'test@peace2hearts.com',
        scheduled_at: '2024-01-15T10:00:00Z'
      }
    })
  });
  
  console.log('Status:', response.status);
  console.log('Response:', await response.json());
}

// Test manual verify-payment
async function testManualVerifyPayment() {
  console.log('🧪 Testing manual verify-payment (backward compatibility)...');
  
  const response = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
      'Content-Type': 'application/json'
      // No X-Razorpay-Signature header = manual mode
    },
    body: JSON.stringify({
      razorpay_order_id: testOrderId,
      booking: {
        email: 'test@peace2hearts.com',
        scheduled_at: '2024-01-15T10:00:00Z'
      }
    })
  });
  
  console.log('Status:', response.status);
  console.log('Response:', await response.json());
}

export { testPaymentStatus, testReconcilePayment, testManualVerifyPayment };