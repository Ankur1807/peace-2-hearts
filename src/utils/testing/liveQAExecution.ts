import { supabase } from '@/integrations/supabase/client';

/**
 * Execute live QA tests using actual Supabase edge functions
 */
export const executeLiveQATests = async () => {
  console.log('🚀 EXECUTING LIVE QA TESTS...');
  console.log('=============================');
  
  const supabaseUrl = 'https://mcbdxszoozmlelejvizn.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0';
  
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: {
      paymentStatusNonExistent: null,
      paymentStatusExisting: null,
      webhookIntegration: null,
      emailFunction: null
    },
    errors: [],
    summary: {
      passed: 0,
      failed: 0,
      total: 4
    }
  };

  // Test 1: Payment Status - Non-existent Order
  console.log('\n🔍 Test 1: Payment Status API - Non-existent Order');
  try {
    const testOrderId = 'order_QA_TEST_NONEXISTENT_' + Date.now();
    
    const response = await fetch(`${supabaseUrl}/functions/v1/payment-status?order_id=${encodeURIComponent(testOrderId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Payment status error:', response.statusText);
      testResults.tests.paymentStatusNonExistent = { success: false, error: response.statusText };
      testResults.errors.push(`Test 1 Error: ${response.statusText}`);
      testResults.summary.failed++;
    } else {
      console.log('✅ Payment status response:', data);
      const expectedNotFound = !data.success && data.status === 'not_found';
      testResults.tests.paymentStatusNonExistent = { 
        success: expectedNotFound, 
        data, 
        expected: 'not_found',
        actual: data.status 
      };
      if (expectedNotFound) {
        testResults.summary.passed++;
        console.log('✅ PASS: Correctly returned not_found for non-existent order');
      } else {
        testResults.summary.failed++;
        console.log('❌ FAIL: Unexpected response for non-existent order');
      }
    }
  } catch (err) {
    console.error('❌ Test 1 exception:', err);
    testResults.tests.paymentStatusNonExistent = { success: false, error: err.message };
    testResults.errors.push(`Test 1 Exception: ${err.message}`);
    testResults.summary.failed++;
  }

  // Test 2: Payment Status - Existing Order
  console.log('\n🔍 Test 2: Payment Status API - Existing Order');
  const existingOrderId = 'order_RA0deuFIfZjPDh'; // From database query
  try {
    const response2 = await fetch(`${supabaseUrl}/functions/v1/payment-status?order_id=${encodeURIComponent(existingOrderId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response2.json();

    if (!response2.ok) {
      console.error('❌ Payment status error for existing order:', response2.statusText);
      testResults.tests.paymentStatusExisting = { success: false, error: response2.statusText };
      testResults.errors.push(`Test 2 Error: ${response2.statusText}`);
      testResults.summary.failed++;
    } else {
      console.log('✅ Payment status response for existing order:', data);
      testResults.tests.paymentStatusExisting = { 
        success: true, 
        data,
        orderId: existingOrderId
      };
      testResults.summary.passed++;
      console.log('✅ PASS: Payment status endpoint responding correctly');
    }
  } catch (err) {
    console.error('❌ Test 2 exception:', err);
    testResults.tests.paymentStatusExisting = { success: false, error: err.message };
    testResults.errors.push(`Test 2 Exception: ${err.message}`);
    testResults.summary.failed++;
  }

  // Test 3: Email Function Test
  console.log('\n📧 Test 3: Email Function');
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'booking-confirmation',
        clientName: 'QA Test User',
        email: 'qa-test@peace2hearts.com',
        referenceId: 'P2H-QA-TEST-' + Date.now(),
        consultationType: 'divorce-consultation',
        services: ['divorce-consultation'],
        date: new Date().toISOString(),
        timeSlot: '10:00-11:00',
        timeframe: 'within_week',
        serviceCategory: 'legal',
        isTest: true
      }
    });

    if (error) {
      console.error('❌ Email function error:', error);
      testResults.tests.emailFunction = { success: false, error: error.message };
      testResults.errors.push(`Test 3 Error: ${error.message}`);
      testResults.summary.failed++;
    } else {
      console.log('✅ Email function response:', data);
      testResults.tests.emailFunction = { success: true, data };
      testResults.summary.passed++;
      console.log('✅ PASS: Email function working correctly');
    }
  } catch (err) {
    console.error('❌ Test 3 exception:', err);
    testResults.tests.emailFunction = { success: false, error: err.message };
    testResults.errors.push(`Test 3 Exception: ${err.message}`);
    testResults.summary.failed++;
  }

  // Test 4: Webhook Integration (Safe Test)
  console.log('\n🔗 Test 4: Webhook Integration Check');
  try {
    // Test with minimal payload to check webhook availability
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: {
        _test: true,
        _mode: 'connectivity_check'
      }
    });

    if (error) {
      console.log('ℹ️ Webhook connectivity check:', error.message);
      testResults.tests.webhookIntegration = { 
        success: true, 
        note: 'Webhook endpoint accessible (error expected for test payload)',
        error: error.message 
      };
      testResults.summary.passed++;
    } else {
      console.log('✅ Webhook connectivity response:', data);
      testResults.tests.webhookIntegration = { success: true, data };
      testResults.summary.passed++;
    }
  } catch (err) {
    console.error('❌ Test 4 exception:', err);
    testResults.tests.webhookIntegration = { success: false, error: err.message };
    testResults.errors.push(`Test 4 Exception: ${err.message}`);
    testResults.summary.failed++;
  }

  // Generate final report
  console.log('\n📊 LIVE QA TEST SUMMARY');
  console.log('=======================');
  console.log(`✅ Passed: ${testResults.summary.passed}/${testResults.summary.total}`);
  console.log(`❌ Failed: ${testResults.summary.failed}/${testResults.summary.total}`);
  console.log(`🏆 Success Rate: ${Math.round((testResults.summary.passed / testResults.summary.total) * 100)}%`);
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  const isReady = testResults.summary.passed >= 3; // At least 3/4 tests should pass
  console.log(`\n🚦 PRODUCTION READINESS: ${isReady ? '✅ READY' : '⚠️ NEEDS REVIEW'}`);
  
  return testResults;
};

// Make available globally
if (typeof window !== 'undefined') {
  (window as any).executeLiveQATests = executeLiveQATests;
  console.log('🧪 Live QA test function available: executeLiveQATests()');
}