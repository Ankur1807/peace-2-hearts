
/**
 * Edge Function Direct Test Utility
 * 
 * This utility directly tests the verify-payment edge function without 
 * relying on the frontend UI or actual payment gateways.
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Execute a direct test of the verify-payment edge function
 */
export async function testVerifyPaymentEdgeFunction() {
  console.log('🧪 STARTING EDGE FUNCTION DIRECT TEST');
  console.log('==============================================');
  
  const testPayload = {
    paymentId: "test_payment_123",
    orderId: "test_order_123",
    signature: "test_signature_123",
    bookingDetails: {
      clientName: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      referenceId: "P2H-TEST-123",
      consultationType: "test-service",
      services: ["test-service"],
      date: "2025-05-20T12:00:00.000Z",
      timeSlot: "11:00 AM",
      serviceCategory: "mental-health",
      message: "Simulated booking",
      amount: 999
    },
    // Add this test flag to tell the function to use mocked responses
    _testMode: true
  };

  console.log('📤 Sending test payload to verify-payment edge function:');
  console.log(JSON.stringify(testPayload, null, 2));

  try {
    // Call the edge function directly
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: testPayload
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      toast.error('Edge function test failed', {
        description: error.message || 'Unknown error',
      });
      return;
    }

    console.log('📥 Edge function response:', data);

    // Check for success response
    if (data.success && data.verified) {
      console.log('✅ Payment verification successful');
      console.log(`🔀 Redirect URL: ${data.redirectUrl}`);
      
      // Wait a moment for background tasks to complete
      console.log('⏱️ Waiting for background tasks to complete...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check if consultation was created
      console.log('🔍 Checking if consultation was created in database...');
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .select('*')
        .eq('reference_id', 'P2H-TEST-123')
        .maybeSingle();

      if (consultationError) {
        console.error('❌ Database lookup error:', consultationError);
        toast.error('Database lookup failed', {
          description: consultationError.message || 'Could not find consultation record',
        });
        return;
      }

      if (consultationData) {
        console.log('✅ Consultation record found:');
        console.log(JSON.stringify(consultationData, null, 2));
        
        // Validate important fields
        const validations = [
          { test: 'source === "edge"', result: consultationData.source === 'edge' },
          { test: 'email_sent === true', result: consultationData.email_sent === true },
          { test: 'reference_id === "P2H-TEST-123"', result: consultationData.reference_id === 'P2H-TEST-123' },
          { test: 'date is correct', result: new Date(consultationData.date).toISOString() === '2025-05-20T12:00:00.000Z' },
          { test: 'payment_id is set', result: !!consultationData.payment_id }
        ];

        console.log('🧪 Validation Results:');
        let allTestsPassed = true;
        
        validations.forEach(validation => {
          const symbol = validation.result ? '✅' : '❌';
          console.log(`${symbol} ${validation.test}: ${validation.result}`);
          if (!validation.result) allTestsPassed = false;
        });

        if (allTestsPassed) {
          console.log('🎉 ALL TESTS PASSED!');
          toast.success('Edge function test successful', {
            description: 'All validations passed. Check console for details.',
          });
        } else {
          console.warn('⚠️ SOME TESTS FAILED!');
          toast.warning('Edge function test partially successful', {
            description: 'Some validations failed. Check console for details.',
          });
        }
      } else {
        console.error('❌ No consultation record found with reference ID: P2H-TEST-123');
        toast.error('Test failed', {
          description: 'No consultation record was created',
        });
      }
    } else {
      console.error('❌ Payment verification failed:', data.error || 'Unknown reason');
      toast.error('Payment verification failed', {
        description: data.error || 'Unknown reason',
      });
    }
  } catch (error) {
    console.error('❌ Test execution error:', error);
    toast.error('Test execution failed', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
