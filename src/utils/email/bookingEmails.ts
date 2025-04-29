import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { getConsultationTypeLabel } from "@/utils/consultationLabels";
import { formatDate, formatDateISOString } from "@/utils/dateUtils";
import { getTimeSlotLabel } from "@/utils/consultation/timeSlotUtils";
import { getPackageName } from "@/utils/consultation/packageUtils";
import { formatPrice } from "@/utils/pricing";

// Keep track of email sending attempts
const emailAttempts = new Map<string, number>();
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 10000; // 10 seconds

/**
 * Send a booking confirmation email with retry mechanism
 */
export async function sendBookingConfirmationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  const emailId = `booking-${bookingDetails.referenceId}-${Date.now()}`;
  const attemptCount = emailAttempts.get(emailId) || 0;
  
  if (attemptCount >= MAX_RETRY_ATTEMPTS) {
    console.error(`Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) reached for email ${emailId}`);
    return false;
  }
  
  emailAttempts.set(emailId, attemptCount + 1);
  
  try {
    console.info(`Sending booking confirmation email with data:`, {
      referenceId: bookingDetails.referenceId,
      email: bookingDetails.email,
      clientName: bookingDetails.clientName,
      isResend: bookingDetails.isResend,
      date: bookingDetails.date ? new Date(bookingDetails.date).toISOString() : undefined
    });
    
    let response = await sendBookingConfirmationEmailInternal(bookingDetails);
    
    if (!response.success) {
      // Schedule retry
      console.info(`Email sending failed, scheduling retry in ${RETRY_DELAY/1000} seconds. Attempt: ${attemptCount + 1}`);
      setTimeout(() => {
        console.info(`Retrying email ${emailId}, attempt ${attemptCount + 2}`);
        sendBookingConfirmationEmail(bookingDetails);
      }, RETRY_DELAY);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error sending booking confirmation email:`, error);
    
    // Schedule retry
    setTimeout(() => {
      console.info(`Retrying email ${emailId}, attempt ${attemptCount + 2}`);
      sendBookingConfirmationEmail(bookingDetails);
    }, RETRY_DELAY);
    
    return false;
  }
}

/**
 * Internal function to send booking confirmation email through the edge function
 */
async function sendBookingConfirmationEmailInternal(bookingDetails: BookingDetails): Promise<{success: boolean}> {
  try {
    // Format date and time for the email
    let dateDisplay = "To be scheduled";
    let timeDisplay = "";
    
    if (bookingDetails.date) {
      dateDisplay = formatDate(new Date(bookingDetails.date));
      if (bookingDetails.timeSlot) {
        timeDisplay = getTimeSlotLabel(bookingDetails.timeSlot);
      }
    } else if (bookingDetails.timeframe) {
      dateDisplay = "Within ";
      timeDisplay = bookingDetails.timeframe.replace(/-/g, ' ');
    }
    
    // Determine service type label
    let serviceType = bookingDetails.consultationType || "";
    const packageName = getPackageName(bookingDetails.services || []);
    
    if (packageName) {
      serviceType = packageName;
    } else if (Array.isArray(bookingDetails.services) && bookingDetails.services.length > 0) {
      serviceType = bookingDetails.services.map(getConsultationTypeLabel).join(", ");
    } else {
      serviceType = getConsultationTypeLabel(serviceType);
    }
    
    // Get price if available
    const priceDisplay = bookingDetails.amount ? formatPrice(bookingDetails.amount) : "Price will be confirmed";
    
    const emailData = {
      to: bookingDetails.email,
      clientName: bookingDetails.clientName,
      referenceId: bookingDetails.referenceId,
      serviceType: serviceType,
      date: dateDisplay,
      time: timeDisplay,
      price: priceDisplay,
      isResend: bookingDetails.isResend || false,
      highPriority: bookingDetails.highPriority || false
    };
    
    console.log(`Sending booking confirmation email via edge function with data:`, emailData);
    
    // Call the edge function to send the email
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'booking-confirmation',
          data: emailData
        }
      });
      
      if (error) {
        console.error(`Error calling send-email function:`, error);
        return { success: false };
      }
      
      console.log(`Email function response:`, data);
      return { success: true };
    } catch (functionError) {
      console.error(`Exception calling send-email function:`, functionError);
      return { success: false };
    }
  } catch (error) {
    console.error(`Error sending booking confirmation email:`, error);
    return { success: false };
  }
}

/**
 * Send a admin notification email about a new booking
 */
export async function sendAdminBookingNotificationEmail(bookingDetails: BookingDetails): Promise<boolean> {
  try {
    // Will be implemented when needed
    return true;
  } catch (error) {
    console.error(`Error sending admin booking notification:`, error);
    return false;
  }
}
