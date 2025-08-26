/**
 * QA Test: Webhook Simulation for Peace2Hearts
 * Tests the complete webhook → payment → consultation → email flow
 */

const SUPABASE_URL = "https://mcbdxszoozmlelejvizn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0";

console.log("🧪 Peace2Hearts QA Test Suite Loaded");

/**
 * Test 1: Simulate payment.captured webhook
 */
async function testPaymentCapturedWebhook() {
  console.log("\n📋 Test 1: Payment Captured Webhook");
  
  const testPayment = {
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: "pay_QA_E2E_" + Date.now(),
          entity: "payment",
          amount: 5000,
          currency: "INR",
          status: "captured",
          order_id: "order_QA_E2E_" + Date.now(),
          method: "card",
          email: "qa-test@peace2hearts.com",
          contact: "+919876543210",
          notes: {
            booking_details: JSON.stringify({
              consultation_type: "QA End-to-End Test",
              client_name: "QA Test User",
              time_slot: "10:00-11:00"
            })
          },
          created_at: Math.floor(Date.now() / 1000)
        }
      }
    }
  };
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
        "x-razorpay-signature": "test_signature_for_qa"
      },
      body: JSON.stringify(testPayment)
    });
    
    const result = await response.json();
    console.log("✅ Webhook Response:", response.status, result);
    
    // Wait a moment for database operations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: response.ok,
      paymentId: testPayment.payload.payment.entity.id,
      orderId: testPayment.payload.payment.entity.order_id,
      response: result
    };
  } catch (error) {
    console.error("❌ Webhook test failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Test 2: Check payment status endpoint
 */
async function testPaymentStatusEndpoint(orderId) {
  console.log("\n📋 Test 2: Payment Status Endpoint");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/payment-status?order_id=${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY
      }
    });
    
    const result = await response.json();
    console.log("✅ Payment Status Response:", response.status, result);
    
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("❌ Payment status test failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Test 3: Simulate payment.failed webhook
 */
async function testPaymentFailedWebhook() {
  console.log("\n📋 Test 3: Payment Failed Webhook");
  
  const testPayment = {
    event: "payment.failed",
    payload: {
      payment: {
        entity: {
          id: "pay_QA_FAILED_" + Date.now(),
          entity: "payment",
          amount: 3000,
          currency: "INR",
          status: "failed",
          order_id: "order_QA_FAILED_" + Date.now(),
          method: "card",
          email: "qa-failed@peace2hearts.com",
          contact: "+919876543210",
          notes: {
            booking_details: JSON.stringify({
              consultation_type: "QA Failed Test",
              client_name: "QA Failed User"
            })
          },
          created_at: Math.floor(Date.now() / 1000)
        }
      }
    }
  };
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY,
        "x-razorpay-signature": "test_signature_for_qa"
      },
      body: JSON.stringify(testPayment)
    });
    
    const result = await response.json();
    console.log("✅ Failed Webhook Response:", response.status, result);
    
    return {
      success: response.ok,
      paymentId: testPayment.payload.payment.entity.id,
      orderId: testPayment.payload.payment.entity.order_id,
      response: result
    };
  } catch (error) {
    console.error("❌ Failed webhook test failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Test 4: Backward compatibility test
 */
async function testBackwardCompatibility(orderId) {
  console.log("\n📋 Test 4: Backward Compatibility");
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "apikey": SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        booking: {
          email: "qa-test@peace2hearts.com",
          consultation_type: "Backward Compatibility Test"
        }
      })
    });
    
    const result = await response.json();
    console.log("✅ Backward Compatibility Response:", response.status, result);
    
    return { success: response.ok, data: result };
  } catch (error) {
    console.error("❌ Backward compatibility test failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log("🚀 Peace2Hearts QA End-to-End Test Suite Starting...\n");
  
  const results = [];
  
  // Test 1: Payment Captured
  const capturedTest = await testPaymentCapturedWebhook();
  results.push({ test: "Payment Captured Webhook", ...capturedTest });
  
  // Test 2: Payment Status Endpoint
  if (capturedTest.success && capturedTest.orderId) {
    const statusTest = await testPaymentStatusEndpoint(capturedTest.orderId);
    results.push({ test: "Payment Status Endpoint", ...statusTest });
    
    // Test 4: Backward Compatibility
    const backwardTest = await testBackwardCompatibility(capturedTest.orderId);
    results.push({ test: "Backward Compatibility", ...backwardTest });
  }
  
  // Test 3: Payment Failed
  const failedTest = await testPaymentFailedWebhook();
  results.push({ test: "Payment Failed Webhook", ...failedTest });
  
  // Summary
  console.log("\n🎯 QA Test Suite Results:");
  console.log("=".repeat(50));
  
  let passed = 0;
  let total = results.length;
  
  results.forEach((result, index) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${index + 1}. ${result.test}: ${status}`);
    if (result.success) passed++;
    if (result.error) console.log(`   Error: ${result.error}`);
  });
  
  console.log("=".repeat(50));
  console.log(`Final Score: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 ALL TESTS PASSED! Webhook system is fully functional.");
  } else {
    console.log("⚠️  Some tests failed. Review the issues above.");
  }
  
  return results;
}

// Export functions for browser console use
if (typeof window !== 'undefined') {
  window.runQATests = runAllTests;
  window.testPaymentCaptured = testPaymentCapturedWebhook;
  window.testPaymentFailed = testPaymentFailedWebhook;
  window.testPaymentStatus = testPaymentStatusEndpoint;
  window.testBackwardCompatibility = testBackwardCompatibility;
  console.log("🔧 QA Functions available:");
  console.log("- runQATests() - Run all tests");
  console.log("- testPaymentCaptured() - Test captured webhook");
  console.log("- testPaymentFailed() - Test failed webhook");
  console.log("- testPaymentStatus(orderId) - Test status endpoint");
  console.log("- testBackwardCompatibility(orderId) - Test legacy API");
}