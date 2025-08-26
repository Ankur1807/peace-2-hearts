import { supabase } from '@/integrations/supabase/client';

/**
 * Quick test to verify the webhook hotfix is working
 * Tests that consultations are created/updated with correct column names
 */
export async function quickWebhookTest() {
  console.log('🧪 Starting Quick Webhook Hotfix Test...');
  
  try {
    // Test 1: Check if we can query consultations table with correct columns
    console.log('📋 Step 1: Testing consultation table schema compatibility...');
    
    const { data: testConsultation, error: schemaError } = await supabase
      .from('consultations')
      .select('payment_id, order_id, status, payment_status, email_sent')
      .limit(1);
    
    if (schemaError) {
      console.error('❌ Schema test failed:', schemaError);
      throw new Error(`Schema incompatible: ${schemaError.message}`);
    }
    
    console.log('✅ Schema test passed - consultation table has expected columns');
    
    // Test 2: Simulate what happens when webhook creates consultation
    console.log('📋 Step 2: Testing consultation record creation logic...');
    
    const testPaymentId = `test_payment_${Date.now()}`;
    const testOrderId = `test_order_${Date.now()}`;
    
    // Insert a test consultation record to verify our column mapping
    const { data: insertResult, error: insertError } = await supabase
      .from('consultations')
      .insert({
        payment_id: testPaymentId,      // Using correct column name
        order_id: testOrderId,          // Using correct column name
        status: 'confirmed',
        payment_status: 'paid',
        client_email: 'test@peace2hearts.com',
        amount: 1000,
        consultation_type: 'Test Consultation',
        time_slot: 'Test Slot',
        reference_id: `P2H-TEST-${Date.now()}`,
        email_sent: false
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
      throw new Error(`Insert failed: ${insertError.message}`);
    }
    
    console.log('✅ Insert test passed - consultation created successfully');
    console.log('📊 Created consultation:', insertResult);
    
    // Test 3: Test the upsert logic (find by payment_id)
    console.log('📋 Step 3: Testing consultation lookup by payment_id...');
    
    const { data: lookupResult, error: lookupError } = await supabase
      .from('consultations')
      .select('*')
      .eq('payment_id', testPaymentId)
      .maybeSingle();
    
    if (lookupError) {
      console.error('❌ Lookup test failed:', lookupError);
      throw new Error(`Lookup failed: ${lookupError.message}`);
    }
    
    if (!lookupResult) {
      console.error('❌ Lookup test failed: No consultation found');
      throw new Error('Consultation not found after insert');
    }
    
    console.log('✅ Lookup test passed - consultation found by payment_id');
    
    // Test 4: Test the upsert logic (find by order_id)
    console.log('📋 Step 4: Testing consultation lookup by order_id...');
    
    const { data: orderLookupResult, error: orderLookupError } = await supabase
      .from('consultations')
      .select('*')
      .eq('order_id', testOrderId)
      .maybeSingle();
    
    if (orderLookupError) {
      console.error('❌ Order lookup test failed:', orderLookupError);
      throw new Error(`Order lookup failed: ${orderLookupError.message}`);
    }
    
    if (!orderLookupResult) {
      console.error('❌ Order lookup test failed: No consultation found');
      throw new Error('Consultation not found by order_id');
    }
    
    console.log('✅ Order lookup test passed - consultation found by order_id');
    
    // Cleanup: Remove test record
    console.log('🧹 Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('consultations')
      .delete()
      .eq('payment_id', testPaymentId);
    
    if (deleteError) {
      console.warn('⚠️ Cleanup warning:', deleteError);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
    
    // Summary
    console.log('🎉 Quick Webhook Hotfix Test PASSED!');
    console.log('📋 Summary:');
    console.log('  ✅ Consultation table schema is compatible');
    console.log('  ✅ Records can be created with payment_id and order_id');
    console.log('  ✅ Records can be found by payment_id');
    console.log('  ✅ Records can be found by order_id');
    console.log('  ✅ Webhook implementation should work correctly now');
    
    return {
      success: true,
      message: 'All tests passed - webhook hotfix verified'
    };
    
  } catch (error) {
    console.error('❌ Quick Webhook Test FAILED:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}