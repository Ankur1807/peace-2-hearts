
/**
 * Service for managing payment data in session storage
 */
import { BookingDetails, SerializedBookingDetails } from '@/utils/types';

/**
 * Store payment details in session storage for potential recovery
 */
export function storePaymentDetailsInSession(
  referenceId: string,
  paymentId: string,
  amount: number,
  orderId: string,
  bookingDetails?: BookingDetails | null
): void {
  try {
    console.log("Storing payment details in session:", { 
      referenceId, 
      paymentId, 
      amount, 
      orderId,
      hasBookingDetails: !!bookingDetails
    });
    
    // Store individual values
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    sessionStorage.setItem(`payment_amount_${referenceId}`, amount.toString());
    sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    
    // Store serialized booking details
    if (bookingDetails) {
      const serializedBookingDetails = JSON.stringify(bookingDetails);
      sessionStorage.setItem(`booking_details_${referenceId}`, serializedBookingDetails);
    }
    
    // Also store everything as a single JSON object
    const paymentData = {
      paymentId,
      amount,
      orderId,
      bookingDetails,
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem(`payment_data_${referenceId}`, JSON.stringify(paymentData));
  } catch (error) {
    console.error("Error storing payment details in session:", error);
  }
}

/**
 * Get payment details from session storage
 */
export function getPaymentDetailsFromSession(referenceId: string): {
  paymentId: string;
  amount: number;
  orderId: string;
  bookingDetails?: any;
} {
  try {
    console.log("Retrieving payment details from session for reference ID:", referenceId);
    
    // Try to get the consolidated data first
    const paymentDataJson = sessionStorage.getItem(`payment_data_${referenceId}`);
    if (paymentDataJson) {
      try {
        const paymentData = JSON.parse(paymentDataJson);
        console.log("Found consolidated payment data:", paymentData);
        return paymentData;
      } catch (e) {
        console.error("Error parsing consolidated payment data:", e);
      }
    }
    
    // Fall back to individual items
    const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`) || '';
    const amountStr = sessionStorage.getItem(`payment_amount_${referenceId}`) || '0';
    const orderId = sessionStorage.getItem(`order_id_${referenceId}`) || '';
    
    const amount = parseInt(amountStr, 10) || 0;
    
    // Try to get booking details
    let bookingDetails;
    const bookingDetailsJson = sessionStorage.getItem(`booking_details_${referenceId}`);
    if (bookingDetailsJson) {
      try {
        bookingDetails = JSON.parse(bookingDetailsJson);
      } catch (e) {
        console.error("Error parsing booking details:", e);
      }
    }
    
    return {
      paymentId,
      amount,
      orderId,
      bookingDetails
    };
  } catch (error) {
    console.error("Error getting payment details from session:", error);
    return {
      paymentId: '',
      amount: 0,
      orderId: '',
    };
  }
}

/**
 * Clear payment details from session storage
 */
export function clearPaymentDetailsFromSession(referenceId: string): void {
  try {
    sessionStorage.removeItem(`payment_id_${referenceId}`);
    sessionStorage.removeItem(`payment_amount_${referenceId}`);
    sessionStorage.removeItem(`order_id_${referenceId}`);
    sessionStorage.removeItem(`booking_details_${referenceId}`);
    sessionStorage.removeItem(`payment_data_${referenceId}`);
  } catch (error) {
    console.error("Error clearing payment details from session:", error);
  }
}
