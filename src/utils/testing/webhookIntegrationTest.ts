/**
 * Comprehensive Webhook Integration Test Suite
 * 
 * Tests the new webhook-first Razorpay integration end-to-end
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function testWebhookIntegration() {
  console.log('🚀 STARTING WEBHOOK INTEGRATION TEST SUITE');
  console.log('==============================================');
  
  const testResults = {
    paymentStatus: false,
    reconcileHealth: false,
    manualVerification: false,
    databaseValidation: false
  };

  // Test 1: Payment Status Endpoint
  console.log('\n📊 TEST 1: Payment-Status Endpoint');
  console.log('Testing GET /payment-status with non-existent order');
  
  try {
    const statusResponse = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/payment-status?order_id=order_TEST987654321`, {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0`
      }
    });
    
    console.log(`Status Code: ${statusResponse.status}`);
    const statusData = await statusResponse.json();
    console.log('Response:', JSON.stringify(statusData, null, 2));
    
    // Expected: 200 with status: "not_found"
    if (statusResponse.status === 200 && statusData.status === 'not_found') {
      console.log('✅ Payment Status endpoint working correctly');
      testResults.paymentStatus = true;
    } else {
      console.log('❌ Payment Status endpoint failed');
    }
  } catch (error) {
    console.error('❌ Payment Status test error:', error);
  }

  // Test 2: Reconcile Payment Health Check
  console.log('\n🔧 TEST 2: Reconcile Payment Health Check');
  console.log('Testing GET /reconcile-payment');
  
  try {
    const healthResponse = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/reconcile-payment`, {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0`
      }
    });
    
    console.log(`Status Code: ${healthResponse.status}`);
    const healthData = await healthResponse.json();
    console.log('Response:', JSON.stringify(healthData, null, 2));
    
    // Expected: 200 with { ok: true, service: 'reconcile-payment' }
    if (healthResponse.status === 200 && healthData.ok === true) {
      console.log('✅ Reconcile Payment health check working');
      testResults.reconcileHealth = true;
    } else {
      console.log('❌ Reconcile Payment health check failed');
    }
  } catch (error) {
    console.error('❌ Reconcile Payment health test error:', error);
  }

  // Test 3: Manual Verification (Backward Compatibility)
  console.log('\n🔄 TEST 3: Manual Verification (Backward Compatibility)');
  console.log('Testing POST /verify-payment without webhook signature');
  
  const manualPayload = {
    razorpay_order_id: 'order_TEST987654321',
    booking: {
      email: 'test@peace2hearts.com',
      scheduled_at: '2024-01-15T10:00:00Z',
      clientName: 'Test User'
    }
  };
  
  try {
    const manualResponse = await fetch(`https://mcbdxszoozmlelejvizn.supabase.co/functions/v1/verify-payment`, {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(manualPayload)
    });
    
    console.log(`Status Code: ${manualResponse.status}`);
    const manualData = await manualResponse.json();
    console.log('Response:', JSON.stringify(manualData, null, 2));
    
    // Expected: 200 with success: false, reason: "Payment not found or failed"
    // Since we're using a test order ID that doesn't exist in Razorpay
    if (manualResponse.status === 200 && manualData.success === false) {
      console.log('✅ Manual verification working (correctly failed for non-existent order)');
      testResults.manualVerification = true;
    } else {
      console.log('❌ Manual verification failed unexpectedly');
    }
  } catch (error) {
    console.error('❌ Manual verification test error:', error);
  }

  // Test 4: Database State Validation
  console.log('\n📊 TEST 4: Database State Validation');
  console.log('Checking payments and consultations tables');
  
  try {
    // Check payments table
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('rzp_order_id', 'order_TEST987654321');
    
    if (paymentsError) {
      console.error('❌ Payments query error:', paymentsError);
    } else {
      console.log(`Payments table entries for test order: ${payments.length}`);
    }

    // Check consultations table (using existing columns)
    const { data: consultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('*')
      .eq('order_id', 'order_TEST987654321');
    
    if (consultationsError) {
      console.error('❌ Consultations query error:', consultationsError);
    } else {
      console.log(`Consultations table entries for test order: ${consultations.length}`);
    }

    // Database should be clean since no actual payment was processed
    if (payments.length === 0 && consultations.length === 0) {
      console.log('✅ Database state clean (as expected for failed payments)');
      testResults.databaseValidation = true;
    } else {
      console.log('⚠️ Unexpected data in database');
    }
  } catch (error) {
    console.error('❌ Database validation error:', error);
  }

  // Final Results
  console.log('\n🏁 TEST SUITE RESULTS');
  console.log('==============================================');
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`Overall: ${passedTests}/${totalTests} tests passed`);
  console.log('Detailed Results:');
  console.log(`  Payment Status Endpoint: ${testResults.paymentStatus ? '✅' : '❌'}`);
  console.log(`  Reconcile Health Check: ${testResults.reconcileHealth ? '✅' : '❌'}`);
  console.log(`  Manual Verification: ${testResults.manualVerification ? '✅' : '❌'}`);
  console.log(`  Database Validation: ${testResults.databaseValidation ? '✅' : '❌'}`);

  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED!');
    toast.success('Webhook Integration Test Suite Passed', {
      description: `${passedTests}/${totalTests} tests successful`,
    });
  } else {
    console.log('⚠️ SOME TESTS FAILED!');
    toast.warning('Webhook Integration Test Suite Partial', {
      description: `${passedTests}/${totalTests} tests passed. Check console for details.`,
    });
  }

  return testResults;
}

export async function testSchemaCompatibility() {
  console.log('\n🔍 SCHEMA COMPATIBILITY TEST');
  console.log('Checking if consultations table has expected columns...');
  
  try {
    // Try to query with new column names
    const { data, error } = await supabase
      .from('consultations')
      .select('rzp_payment_id, rzp_order_id')
      .limit(1);
    
    if (error) {
      console.error('❌ CRITICAL SCHEMA ISSUE DETECTED:');
      console.error('Consultations table missing rzp_payment_id/rzp_order_id columns');
      console.error('Current webhook code will fail to upsert consultations');
      console.error('Error:', error);
      
      toast.error('Schema Compatibility Issue', {
        description: 'Consultations table schema needs updating for webhook integration',
      });
      
      return false;
    } else {
      console.log('✅ Schema compatibility confirmed');
      return true;
    }
  } catch (error) {
    console.error('❌ Schema compatibility test error:', error);
    return false;
  }
}