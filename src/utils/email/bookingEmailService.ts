
/**
 * Email Service for Booking and Payments
 * 
 * This module handles all email notifications related to bookings and payments
 * with proper error handling and retry mechanisms.
 */
import { supabase } from '@/integrations/supabase/client';
import { BookingDetails } from '@/utils/types';
import { determineServiceCategory } from '@/utils/payment/services/serviceUtils';
import { formatDate } from '@/utils/dateUtils';
import { getTimeSlotLabel } from '@/utils/consultation/timeSlotUtils';

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
