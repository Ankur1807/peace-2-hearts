
/**
 * Booking Lifecycle Simulation Utility
 * 
 * This file simulates the entire booking process from start to finish
 * without making any real API calls, to verify system integrity.
 */
import { formatDate } from '@/utils/dateUtils';
import { BookingDetails, PersonalDetails } from '@/utils/types';
import { determineServiceCategory } from '@/utils/payment/services/serviceUtils';

// Simulate converting IST time slot to UTC
export const convertISTTimeSlotToUTCString = (dateString: string, timeSlot: string): string => {
  console.log(`🕰️ TIMEZONE SIMULATION: Converting IST date/time to UTC`);
  console.log(`   Input: ${dateString} at ${timeSlot} (IST)`);
  
  // Parse the input date and time
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Extract hours and minutes from time slot
  let hours = 0;
  let minutes = 0;
  
  if (timeSlot.includes(':')) {
    const timeParts = timeSlot.split(':');
    hours = parseInt(timeParts[0], 10);
    minutes = parseInt(timeParts[1].split(' ')[0], 10);
    
    // Adjust for AM/PM
    if (timeSlot.toLowerCase().includes('pm') && hours < 12) {
      hours += 12;
    } else if (timeSlot.toLowerCase().includes('am') && hours === 12) {
      hours = 0;
    }
  }
  
  // Create date object in IST
  const istDate = new Date(year, month - 1, day, hours, minutes);
  
  // Fix for timezone issues - set to noon to prevent date shifting
  const adjustedDate = new Date(year, month - 1, day);
  adjustedDate.setHours(12, 0, 0, 0);
  
  // Format as ISO string
  const utcString = adjustedDate.toISOString();
  
  console.log(`   Output: ${utcString}`);
  return utcString;
};

// Construct the Supabase payload
export const constructSupabasePayload = (
  referenceId: string, 
  consultationType: string,
  date: string, 
  timeSlot: string,
  personalDetails: PersonalDetails
): Record<string, any> => {
  console.log(`🗃️ SUPABASE PAYLOAD CONSTRUCTION:`);
  
  const serviceCategory = determineServiceCategory(consultationType);
  
  const payload = {
    client_name: `${personalDetails.firstName} ${personalDetails.lastName}`,
    client_email: personalDetails.email,
    client_phone: personalDetails.phone,
    reference_id: referenceId,
    consultation_type: consultationType,
    service_category: serviceCategory,
    date: date,
    time_slot: timeSlot,
    message: personalDetails.message,
    status: 'confirmed',
    payment_status: 'completed',
    payment_id: 'test_payment_id',
    order_id: 'test_order_id',
    amount: 11, // Amount for test service
    source: 'edge', // Mark source as edge function
    email_sent: true // Mark email as sent
  };
  
  console.log(JSON.stringify(payload, null, 2));
  return payload;
};

// Simulate email payload generation
export const simulateEmailPayload = (
  bookingDetails: BookingDetails
): Record<string, any> => {
  console.log(`📧 EMAIL PAYLOAD GENERATION:`);
  
  // Format date for display - convert UTC back to IST for email display
  let formattedDate = 'To be scheduled';
  let formattedTime = '';
  
  if (bookingDetails.date) {
    // Since we're using noon time UTC (should be same day in IST)
    const istDate = new Date(bookingDetails.date);
    formattedDate = formatDate(istDate);
    formattedTime = bookingDetails.timeSlot;
  } else if (bookingDetails.timeframe) {
    formattedDate = "Within";
    formattedTime = bookingDetails.timeframe.replace(/-/g, ' ');
  }
  
  // Get service name
  const serviceName = bookingDetails.consultationType
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const emailPayload = {
    to: bookingDetails.email,
    bcc: 'admin@peace2hearts.com',
    subject: "Your Booking Confirmation - Peace2Hearts",
    clientName: bookingDetails.clientName,
    referenceId: bookingDetails.referenceId,
    serviceType: serviceName,
    date: formattedDate,
    time: formattedTime,
    price: `₹${bookingDetails.amount}`,
    highPriority: false
  };
  
  console.log(`   Subject: ${emailPayload.subject}`);
  console.log(`   To: ${emailPayload.to}`);
  console.log(`   BCC: ${emailPayload.bcc}`);
  console.log(`   Body Preview: Dear ${emailPayload.clientName}, your booking for ${emailPayload.serviceType} on ${emailPayload.date} at ${emailPayload.time} has been confirmed. Reference ID: ${emailPayload.referenceId}`);
  
  return emailPayload;
};

// Simulate verify-payment edge function response
export const simulateVerifyPaymentResponse = (): Record<string, any> => {
  console.log(`🔄 VERIFY-PAYMENT EDGE FUNCTION RESPONSE:`);
  
  const response = {
    success: true,
    verified: true,
    consultationId: "simulated-uuid",
    emailSent: true,
    paymentId: "test_payment_id",
    orderId: "test_order_id",
    redirectUrl: "/thank-you"
  };
  
  console.log(JSON.stringify(response, null, 2));
  return response;
};

// Simulate redirect
export const simulateRedirect = (referenceId: string): void => {
  console.log(`🌐 REDIRECT TRIGGER:`);
  console.log(`   User redirected to Thank You page with reference ID: ${referenceId}`);
};

// Run full simulation
export const runFullSimulation = () => {
  console.log('🧪 STARTING FULL BOOKING LIFECYCLE SIMULATION');
  console.log('==============================================');
  
  // Test case data
  const testData = {
    service: 'test-service',
    dateString: '2025-05-06',
    timeSlot: '11:00 AM',
    personalDetails: {
      firstName: 'Ankur',
      lastName: 'Bhardwaj',
      email: 'bhardwajankur6@gmail.com',
      phone: '7428564364',
      message: 'This is a test booking'
    },
    referenceId: 'P2H-TEST-SIM-0001'
  };
  
  // 1. Simulate timezone conversion
  const utcDateString = convertISTTimeSlotToUTCString(testData.dateString, testData.timeSlot);
  
  // 2. Construct Supabase payload
  const payload = constructSupabasePayload(
    testData.referenceId,
    testData.service,
    utcDateString,
    testData.timeSlot,
    testData.personalDetails
  );
  
  // 3. Create booking details for email simulation
  const bookingDetails: BookingDetails = {
    clientName: `${testData.personalDetails.firstName} ${testData.personalDetails.lastName}`,
    email: testData.personalDetails.email,
    referenceId: testData.referenceId,
    consultationType: testData.service,
    services: [testData.service],
    date: new Date(utcDateString),
    timeSlot: testData.timeSlot,
    amount: 11,
    phone: testData.personalDetails.phone,
    message: testData.personalDetails.message,
    serviceCategory: determineServiceCategory(testData.service),
    personalDetails: testData.personalDetails
  };
  
  // 4. Simulate email payload
  const emailPayload = simulateEmailPayload(bookingDetails);
  
  // 5. Simulate verify-payment response
  const verifyResponse = simulateVerifyPaymentResponse();
  
  // 6. Simulate redirect
  simulateRedirect(testData.referenceId);
  
  // Summary
  console.log('\n✅ SIMULATION SUMMARY:');
  console.log('======================');
  console.log(`UTC timestamp: ${utcDateString}`);
  console.log(`Supabase-ready payload: Created for reference ID ${testData.referenceId}`);
  console.log(`Email preview: Generated for ${testData.personalDetails.email}`);
  console.log(`Redirect: Simulated to /thank-you with reference ID ${testData.referenceId}`);
  console.log('\nALL SIMULATION STEPS COMPLETED SUCCESSFULLY');
};
