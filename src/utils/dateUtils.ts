
/**
 * Format a date to ISO string
 */
export function formatDateISOString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString();
}

/**
 * Format a date to a human-readable format
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Convert IST time slot to UTC ISO string
 * Properly handles the IST (+5:30) to UTC conversion
 * Always returns an ISO string for database storage
 */
export function convertISTTimeSlotToUTCString(dateString: string, timeSlot: string): string {
  const [hourStr, meridian] = timeSlot.split('-');
  let hour = parseInt(hourStr, 10);
  if (meridian.toLowerCase() === 'pm' && hour < 12) hour += 12;
  if (meridian.toLowerCase() === 'am' && hour === 12) hour = 0;
  const istDate = new Date(`${dateString}T${hour.toString().padStart(2, '0')}:00:00+05:30`);
  console.log(`[convertISTTimeSlotToUTCString] Converting IST date: ${dateString}, time: ${timeSlot} to UTC: ${istDate.toISOString()}`);
  return istDate.toISOString(); // returns a UTC-formatted ISO string
}

/**
 * Format a local date and time for display
 */
export function formatLocalDateTime(date: Date | string | undefined, timeSlot: string | undefined): string {
  if (!date) return 'Date to be confirmed';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format time if provided
    if (timeSlot) {
      const formattedTime = timeSlot.replace('-', ':').toUpperCase();
      return `${formattedDate} at ${formattedTime}`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting local date and time:', error);
    return 'Invalid date/time';
  }
}

// Simple test function for the booking simulation
export function simulateBookingFlow() {
  const testDate = "2025-05-02";
  const testTimeSlot = "11-am";
  
  // Step 1: Convert IST to UTC
  const utcDateString = convertISTTimeSlotToUTCString(testDate, testTimeSlot);
  console.log("SIMULATION - UTC date string:", utcDateString);
  console.assert(utcDateString === "2025-05-02T05:30:00.000Z", "UTC conversion incorrect");
  
  // Step 2: Build mock Supabase payload
  const mockSupabasePayload = {
    client_name: "Ankur Bhardwaj",
    client_email: "bhardwajankur6@gmail.com",
    client_phone: "7428564364",
    reference_id: "P2H-670165-0071",
    consultation_type: "Test Service",
    date: utcDateString,  // UTC ISO string for database storage
    time_slot: "11-am",
    service_category: "mental_health",
    message: null,
    payment_id: "pay_sim12345",
    order_id: "order_sim12345",
    amount: 1500,
    payment_status: "completed",
    status: "confirmed",
    email_sent: false,
    source: "edge"
  };
  console.log("SIMULATION - Supabase payload:", JSON.stringify(mockSupabasePayload, null, 2));
  
  // Step 3: Generate mock email content
  const mockEmailContent = {
    to: "bhardwajankur6@gmail.com",
    bcc: "admin@peace2hearts.com",
    subject: "Booking Confirmation - Peace2Hearts",
    clientName: "Ankur Bhardwaj",
    referenceId: "P2H-670165-0071",
    serviceType: "Test Service",
    date: "Friday, May 2, 2025",  // Back to IST for user display
    time: "11:00 AM",
    price: "₹1,500",
    highPriority: true
  };
  console.log("SIMULATION - Email preview:", JSON.stringify(mockEmailContent, null, 2));
  
  // Step 4: Simulate verify-payment response
  const verificationResponse = {
    success: true,
    verified: true,
    redirectUrl: '/thank-you'
  };
  console.log("SIMULATION - Payment verification response:", JSON.stringify(verificationResponse, null, 2));
  console.log("SIMULATION - Triggering redirect to:", verificationResponse.redirectUrl);
  
  return {
    utcDateString,
    supabasePayload: mockSupabasePayload,
    emailContent: mockEmailContent,
    verificationResponse
  };
}
