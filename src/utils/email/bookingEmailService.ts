
/**
 * Email Service for Booking and Payments
 * 
 * This module handles all email notifications related to bookings and payments
 * with proper error handling and retry mechanisms.
 */
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { determineServiceCategory } from '@/utils/payment/services/serviceUtils';

/**
 * Format a date to a human-readable format
 */
function formatDate(date: Date | string | undefined): string {
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
 * Get a human-readable label for a time slot
 */
function getTimeSlotLabel(timeSlot: string): string {
  // Handle common time slot formats
  if (timeSlot.includes(':')) {
    return timeSlot; // Already formatted as HH:MM
  }
  
  // Convert slot IDs to readable format
  const slotMap: Record<string, string> = {
    'morning': '9:00 AM - 12:00 PM',
    'afternoon': '12:00 PM - 3:00 PM',
    'evening': '3:00 PM - 6:00 PM',
    'night': '6:00 PM - 9:00 PM',
    'slot-1': '9:00 AM - 10:00 AM',
    'slot-2': '10:00 AM - 11:00 AM',
    'slot-3': '11:00 AM - 12:00 PM',
    'slot-4': '12:00 PM - 1:00 PM',
    'slot-5': '1:00 PM - 2:00 PM',
    'slot-6': '2:00 PM - 3:00 PM',
    'slot-7': '3:00 PM - 4:00 PM',
    'slot-8': '4:00 PM - 5:00 PM',
    'slot-9': '5:00 PM - 6:00 PM',
    'slot-10': '6:00 PM - 7:00 PM',
    'slot-11': '7:00 PM - 8:00 PM',
    'slot-12': '8:00 PM - 9:00 PM'
  };
  
  return slotMap[timeSlot] || timeSlot;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    console.log(`Sending booking confirmation email for ${bookingDetails.referenceId}`);
    
    // Validate required fields
    if (!bookingDetails.email || !bookingDetails.referenceId) {
      console.error('Missing required fields for booking confirmation email:', {
        hasEmail: !!bookingDetails.email,
        hasReferenceId: !!bookingDetails.referenceId
      });
      return false;
    }
    
    // Format the date if present
    const formattedDate = bookingDetails.date ? formatDate(bookingDetails.date) : 'To be scheduled';
    
    // Format the time slot if present
    const formattedTimeSlot = bookingDetails.timeSlot ? getTimeSlotLabel(bookingDetails.timeSlot) : '';
    
    // Determine service category from consultation type if not provided
    const serviceCategory = bookingDetails.serviceCategory || 
      determineServiceCategory(bookingDetails.consultationType);
    
    // Prepare email payload
    const emailPayload = {
      type: 'booking-confirmation',
      data: {
        to: bookingDetails.email,
        clientName: bookingDetails.clientName,
        referenceId: bookingDetails.referenceId,
        serviceType: bookingDetails.consultationType,
        date: formattedDate,
        time: formattedTimeSlot || bookingDetails.timeframe || '',
        price: bookingDetails.amount ? `₹${bookingDetails.amount}` : 'Price will be confirmed',
        highPriority: bookingDetails.highPriority || false,
        isResend: bookingDetails.isResend || false
      }
    };
    
    // Send the email using edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailPayload
    });
    
    if (error) {
      console.error('Error sending booking confirmation email:', error);
      return false;
    }
    
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception sending booking confirmation email:', error);
    return false;
  }
}

/**
 * Resend a booking confirmation email
 */
export async function resendBookingConfirmationEmail(referenceId: string): Promise<boolean> {
  try {
    console.log(`Attempting to resend booking confirmation email for ${referenceId}`);
    
    const bookingDetails = await fetchBookingDetailsByReference(referenceId);
    if (!bookingDetails) {
      console.error(`No booking found with reference ID ${referenceId}`);
      return false;
    }
    
    // Mark as resend and high priority
    const updatedDetails = {
      ...bookingDetails,
      isResend: true,
      highPriority: true
    };
    
    return await sendBookingConfirmationEmail(updatedDetails);
  } catch (error) {
    console.error(`Error resending email for ${referenceId}:`, error);
    return false;
  }
}

/**
 * Fetch booking details from reference ID
 */
export async function fetchBookingDetailsByReference(referenceId: string): Promise<BookingDetails | null> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching consultation by reference ID:', error);
      return null;
    }
    
    // Determine service category from consultation type if not provided
    const serviceCategory = data.service_category || 
      determineServiceCategory(data.consultation_type || '');
    
    // Create booking details object
    return {
      clientName: data.client_name || '',
      email: data.client_email || '',
      referenceId: data.reference_id || '',
      consultationType: data.consultation_type || '',
      services: data.consultation_type ? [data.consultation_type] : [],
      date: data.date ? new Date(data.date) : undefined,
      timeSlot: data.time_slot || '',
      timeframe: data.timeframe || '',
      message: data.message || '',
      serviceCategory: serviceCategory,
      amount: data.amount,
      phone: data.client_phone || ''
    };
  } catch (error) {
    console.error('Exception fetching booking details:', error);
    return null;
  }
}

/**
 * Retry sending failed emails
 */
export async function retryFailedEmails(): Promise<{success: number, failed: number}> {
  try {
    console.log("Attempting to retry sending failed emails");
    
    // Get consultations where email_sent is false
    const { data, error } = await supabase
      .from('consultations')
      .select('reference_id')
      .eq('email_sent', false)
      .eq('status', 'confirmed')
      .limit(10);
    
    if (error) {
      console.error('Error fetching failed email records:', error);
      return { success: 0, failed: 0 };
    }
    
    if (!data || data.length === 0) {
      console.log('No failed emails to retry');
      return { success: 0, failed: 0 };
    }
    
    let successCount = 0;
    let failedCount = 0;
    
    // Try to resend each email
    for (const item of data) {
      const result = await resendBookingConfirmationEmail(item.reference_id);
      if (result) {
        successCount++;
      } else {
        failedCount++;
      }
    }
    
    console.log(`Email retry complete. Success: ${successCount}, Failed: ${failedCount}`);
    return { success: successCount, failed: failedCount };
  } catch (error) {
    console.error('Exception in retryFailedEmails:', error);
    return { success: 0, failed: 0 };
  }
}
