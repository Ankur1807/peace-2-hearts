import { supabase } from '@/integrations/supabase/client';

/**
 * Test the payment-status endpoint directly
 */
export const testPaymentStatusEndpoint = async (orderId: string) => {
  console.log(`🔍 Testing payment-status endpoint for order: ${orderId}`);
  
  try {
    // Test the payment-status endpoint
    const { data, error } = await supabase.functions.invoke('payment-status', {
      body: {
        order_id: orderId
      }
    });
    
    if (error) {
      console.error('❌ Payment-status error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Payment-status response:', data);
    return { success: true, data };
    
  } catch (err) {
    console.error('❌ Payment-status test error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Run comprehensive payment flow QA
 */
export const runPaymentFlowQA = async () => {
  const results = {
    codebaseCheck: {},
    apiTests: {},
    databaseChecks: {},
    logAnalysis: {}
  };
  
  console.log('🔍 Starting Payment Flow QA...');
  
  // Test with existing order IDs from database
  const testOrderIds = [
    'order_RA0deuFIfZjPDh', // Recent successful order
    'order_QUr6uCF5OYFPOp', // Older successful order
    'order_NONEXISTENT123'  // Non-existent order for negative testing
  ];
  
  for (const orderId of testOrderIds) {
    console.log(`\n--- Testing order: ${orderId} ---`);
    const result = await testPaymentStatusEndpoint(orderId);
    results.apiTests[orderId] = result;
  }
  
  return results;
};

// Export for global console access
if (typeof window !== 'undefined') {
  (window as any).testPaymentStatusEndpoint = testPaymentStatusEndpoint;
  (window as any).runPaymentFlowQA = runPaymentFlowQA;
  console.log('🧪 Payment QA functions available:');
  console.log('- testPaymentStatusEndpoint("order_id")');
  console.log('- runPaymentFlowQA()');
}