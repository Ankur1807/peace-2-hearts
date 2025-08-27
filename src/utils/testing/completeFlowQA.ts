import { supabase } from '@/integrations/supabase/client';
import { generateReferenceId } from '@/utils/referenceGenerator';

/**
 * Simulate a complete end-to-end payment flow test
 */
export const simulateCompletePaymentFlow = async () => {
  const testResults = {
    bookingCreation: null,
    paymentOrder: null,
    paymentCapture: null,
    webhookProcessing: null,
    statusCheck: null,
    databaseRecords: null,
    emailConfirmation: null,
    errors: []
  };

  console.log('🚀 Starting Complete Payment Flow Simulation...');
  
  try {
    // Step 1: Create test booking data
    const referenceId = generateReferenceId();
    const testOrderId = `order_QA_TEST_${Date.now()}`;
    const testPaymentId = `pay_QA_TEST_${Date.now()}`;
    
    const testBookingData = {
      referenceId,
      clientName: 'QA Test User',
      email: 'qa-test@peace2hearts.com',
      phone: '+91-9876543210',
      consultationType: 'divorce-consultation',
      services: ['divorce-consultation'],
      date: new Date().toISOString(),
      timeSlot: '10:00-11:00',
      timeframe: 'within_week',
      serviceCategory: 'legal',
      message: 'QA Test booking for payment flow validation',
      amount: 2999
    };

    console.log('📋 Step 1: Test Booking Data Created');
    console.log('Reference ID:', referenceId);
    console.log('Test Order ID:', testOrderId);
    testResults.bookingCreation = { success: true, referenceId, testOrderId };

    // Step 2: Test payment status endpoint with non-existent order (should return not_found)
    console.log('\n🔍 Step 2: Testing Payment Status API');
    const { data: statusData, error: statusError } = await supabase.functions.invoke('payment-status', {
      body: {
        order_id: testOrderId
      }
    });

    if (statusError) {
      console.error('❌ Payment status check failed:', statusError);
      testResults.errors.push(`Payment status error: ${statusError.message}`);
    } else {
      console.log('✅ Payment status response:', statusData);
      testResults.statusCheck = { success: true, data: statusData };
    }

    // Step 3: Create test consultation record
    console.log('\n📝 Step 3: Creating Test Consultation Record');
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .insert({
        reference_id: referenceId,
        order_id: testOrderId,
        client_name: testBookingData.clientName,
        client_email: testBookingData.email,
        client_phone: testBookingData.phone,
        consultation_type: testBookingData.consultationType,
        time_slot: testBookingData.timeSlot,
        timeframe: testBookingData.timeframe,
        service_category: testBookingData.serviceCategory,
        message: testBookingData.message,
        amount: testBookingData.amount,
        status: 'pending_payment',
        payment_status: null,
        email_sent: false
      })
      .select()
      .single();

    if (consultationError) {
      console.error('❌ Consultation creation failed:', consultationError);
      testResults.errors.push(`Consultation creation error: ${consultationError.message}`);
    } else {
      console.log('✅ Consultation record created:', consultationData);
      testResults.bookingCreation.consultationId = consultationData.id;
    }

    // Step 4: Simulate webhook payment capture
    console.log('\n💳 Step 4: Simulating Webhook Payment Capture');
    try {
      const webhookPayload = {
        razorpay_payment_id: testPaymentId,
        razorpay_order_id: testOrderId,
        razorpay_signature: 'test_signature_qa',
        bookingDetails: testBookingData
      };

      const { data: webhookData, error: webhookError } = await supabase.functions.invoke('verify-payment', {
        body: webhookPayload
      });

      if (webhookError) {
        console.error('❌ Webhook simulation failed:', webhookError);
        testResults.errors.push(`Webhook error: ${webhookError.message}`);
      } else {
        console.log('✅ Webhook processing result:', webhookData);
        testResults.webhookProcessing = { success: true, data: webhookData };
      }
    } catch (webhookErr) {
      console.error('❌ Webhook simulation error:', webhookErr);
      testResults.errors.push(`Webhook simulation error: ${webhookErr.message}`);
    }

    // Step 5: Check database records after webhook
    console.log('\n🗄️ Step 5: Verifying Database Records');
    
    // Check payments table
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('rzp_order_id', testOrderId);

    if (paymentsError) {
      console.error('❌ Payments query failed:', paymentsError);
      testResults.errors.push(`Payments query error: ${paymentsError.message}`);
    } else {
      console.log('💰 Payments table records:', paymentsData);
      testResults.databaseRecords = { payments: paymentsData };
    }

    // Check consultations table
    const { data: updatedConsultationData, error: updatedConsultationError } = await supabase
      .from('consultations')
      .select('*')
      .eq('order_id', testOrderId);

    if (updatedConsultationError) {
      console.error('❌ Consultations query failed:', updatedConsultationError);
      testResults.errors.push(`Consultations query error: ${updatedConsultationError.message}`);
    } else {
      console.log('📋 Consultations table records:', updatedConsultationData);
      testResults.databaseRecords.consultations = updatedConsultationData;
    }

    // Step 6: Test payment status after webhook
    console.log('\n🔄 Step 6: Testing Payment Status After Webhook');
    const { data: finalStatusData, error: finalStatusError } = await supabase.functions.invoke('payment-status', {
      body: {
        order_id: testOrderId
      }
    });

    if (finalStatusError) {
      console.error('❌ Final payment status check failed:', finalStatusError);
      testResults.errors.push(`Final status error: ${finalStatusError.message}`);
    } else {
      console.log('✅ Final payment status response:', finalStatusData);
      testResults.statusCheck.finalData = finalStatusData;
    }

    // Step 7: Test email trigger
    console.log('\n📧 Step 7: Testing Email Trigger');
    try {
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking-confirmation',
          clientName: testBookingData.clientName,
          email: testBookingData.email,
          referenceId: referenceId,
          consultationType: testBookingData.consultationType,
          services: testBookingData.services,
          date: testBookingData.date,
          timeSlot: testBookingData.timeSlot,
          timeframe: testBookingData.timeframe,
          serviceCategory: testBookingData.serviceCategory,
          isTest: true
        }
      });

      if (emailError) {
        console.error('❌ Email trigger failed:', emailError);
        testResults.errors.push(`Email error: ${emailError.message}`);
      } else {
        console.log('✅ Email trigger result:', emailData);
        testResults.emailConfirmation = { success: true, data: emailData };
      }
    } catch (emailErr) {
      console.error('❌ Email trigger error:', emailErr);
      testResults.errors.push(`Email trigger error: ${emailErr.message}`);
    }

    return testResults;

  } catch (error) {
    console.error('❌ Complete flow simulation error:', error);
    testResults.errors.push(`Complete flow error: ${error.message}`);
    return testResults;
  }
};

/**
 * Generate QA report from test results
 */
export const generateQAReport = (testResults) => {
  console.log('\n📊 GENERATING COMPREHENSIVE QA REPORT...');
  console.log('=====================================');
  
  console.log('\n🎯 TEST EXECUTION SUMMARY:');
  console.log('- Booking Creation:', testResults.bookingCreation?.success ? '✅ PASS' : '❌ FAIL');
  console.log('- Payment Status API:', testResults.statusCheck?.success ? '✅ PASS' : '❌ FAIL');
  console.log('- Webhook Processing:', testResults.webhookProcessing?.success ? '✅ PASS' : '❌ FAIL');
  console.log('- Database Records:', testResults.databaseRecords ? '✅ PASS' : '❌ FAIL');
  console.log('- Email Confirmation:', testResults.emailConfirmation?.success ? '✅ PASS' : '❌ FAIL');
  
  console.log('\n🔍 DETAILED RESULTS:');
  console.log('Reference ID:', testResults.bookingCreation?.referenceId);
  console.log('Test Order ID:', testResults.bookingCreation?.testOrderId);
  
  if (testResults.databaseRecords?.payments) {
    console.log('\n💰 PAYMENTS TABLE:');
    console.table(testResults.databaseRecords.payments);
  }
  
  if (testResults.databaseRecords?.consultations) {
    console.log('\n📋 CONSULTATIONS TABLE:');
    console.table(testResults.databaseRecords.consultations);
  }
  
  if (testResults.statusCheck?.data) {
    console.log('\n🔄 PAYMENT STATUS RESPONSE:');
    console.log(JSON.stringify(testResults.statusCheck.data, null, 2));
  }
  
  if (testResults.errors.length > 0) {
    console.log('\n❌ ERRORS ENCOUNTERED:');
    testResults.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
  
  const passCount = [
    testResults.bookingCreation?.success,
    testResults.statusCheck?.success,
    testResults.webhookProcessing?.success,
    testResults.databaseRecords,
    testResults.emailConfirmation?.success
  ].filter(Boolean).length;
  
  console.log(`\n🏆 OVERALL SCORE: ${passCount}/5 tests passed`);
  console.log(passCount === 5 ? '✅ ALL TESTS PASSED - READY FOR PRODUCTION' : '⚠️ SOME TESTS FAILED - NEEDS REVIEW');
  
  return testResults;
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).simulateCompletePaymentFlow = simulateCompletePaymentFlow;
  (window as any).generateQAReport = generateQAReport;
  (window as any).runCompleteQA = async () => {
    const results = await simulateCompletePaymentFlow();
    return generateQAReport(results);
  };
  
  console.log('🧪 Complete QA functions available:');
  console.log('- simulateCompletePaymentFlow()');
  console.log('- generateQAReport(results)');
  console.log('- runCompleteQA() - Run complete test and generate report');
}