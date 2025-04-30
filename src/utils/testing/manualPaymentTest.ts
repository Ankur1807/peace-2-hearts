
/**
 * Manual Payment Verification Test
 * 
 * This utility directly tests the verify-payment edge function without 
 * relying on the frontend UI or actual payment gateways.
 */
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { toast } from 'sonner';

/**
 * Execute a manual test of the verify-payment edge function
 */
export async function testVerifyPaymentEdgeFunction() {
  // Create a timestamp for unique test reference
  const timestamp = new Date().getTime();
  const referenceId = `P2H-TEST-MANUAL-${timestamp}`;
  
  console.log('🧪 STARTING MANUAL EDGE FUNCTION TEST');
  console.log('==============================================');
  console.log(`Reference ID: ${referenceId}`);
  
  // Create test date that won't shift day when converted to UTC
  // Use noon to prevent timezone issues
  const testDate = new Date('2025-05-15T12:00:00.000Z');
  console.log(`Test date (UTC noon): ${testDate.toISOString()}`);
  
  // Prepare mock booking details - similar structure to what frontend would send
  const mockBookingDetails: BookingDetails = {
    clientName: 'Test User',
    email: 'test@example.com',
    phone: '9876543210',
    referenceId: referenceId,
    consultationType: 'test-service',
    services: ['test-service'],
    date: testDate,
    timeSlot: '15:00',
    amount: 999,
    serviceCategory: 'mental-health',
    personalDetails: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      message: 'This is a test booking via direct edge function call'
    }
  };
  
  // Prepare the payload to send to verify-payment edge function
  const payload = {
    paymentId: `test_payment_${timestamp}`,
    orderId: `test_order_${timestamp}`,
    signature: `test_signature_${timestamp}`,
    bookingDetails: {
      clientName: mockBookingDetails.clientName,
      email: mockBookingDetails.email,
      phone: mockBookingDetails.phone,
      referenceId: mockBookingDetails.referenceId,
      consultationType: mockBookingDetails.consultationType,
      services: mockBookingDetails.services,
      date: mockBookingDetails.date?.toISOString(),
      timeSlot: mockBookingDetails.timeSlot,
      serviceCategory: mockBookingDetails.serviceCategory,
      message: mockBookingDetails.personalDetails?.message,
      amount: mockBookingDetails.amount
    }
  };

  try {
    console.log('📤 Sending test request to verify-payment edge function:');
    console.log(JSON.stringify(payload, null, 2));

    // Call the edge function directly
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: payload
    });

    // Handle error
    if (error) {
      console.error('❌ Edge function error:', error);
      toast.error('Edge function test failed', {
        description: error.message || 'Unknown error',
      });
      return;
    }

    // Log the response
    console.log('📥 Edge function response:', data);

    if (data.success && data.verified) {
      console.log('✅ Payment verification successful');
      console.log(`🔀 Redirect URL: ${data.redirectUrl}`);
    } else {
      console.error('❌ Payment verification failed:', data.error || 'Unknown reason');
      toast.error('Payment verification failed', {
        description: data.error || 'Unknown reason',
      });
      return;
    }

    // Wait a moment for background tasks to complete
    console.log('⏱️ Waiting for background tasks to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check if consultation was created
    console.log('🔍 Checking if consultation was created in database...');
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();

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
      
      // Validate the consultation data
      const validations = [
        { test: 'source === "edge"', result: consultationData.source === 'edge' },
        { test: 'email_sent === true', result: consultationData.email_sent === true },
        { test: 'reference_id === provided value', result: consultationData.reference_id === referenceId },
        { test: 'payment_id is set', result: !!consultationData.payment_id },
        { test: 'date is correct', result: new Date(consultationData.date).toDateString() === testDate.toDateString() }
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
      console.error('❌ No consultation record found with reference ID:', referenceId);
      toast.error('Test failed', {
        description: 'No consultation record was created',
      });
    }
  } catch (error) {
    console.error('❌ Test execution error:', error);
    toast.error('Test execution failed', {
      description: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
