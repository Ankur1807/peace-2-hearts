
import { BookingDetails } from "@/utils/types";

/**
 * Store payment details in session storage as a backup
 */
export function storePaymentDetailsInSession(
  params: {
    referenceId: string, 
    paymentId: string, 
    orderId?: string, 
    amount?: number, 
    bookingDetails?: BookingDetails
  }
): void {
  try {
    const { referenceId, paymentId, orderId, amount, bookingDetails } = params;
    
    // Store essential payment details
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    if (orderId) sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    if (amount) sessionStorage.setItem(`amount_${referenceId}`, amount.toString());
    
    // Store booking details if available
    if (bookingDetails) {
      sessionStorage.setItem(`booking_details_${referenceId}`, JSON.stringify({
        ...bookingDetails,
        date: bookingDetails.date ? 
          (bookingDetails.date instanceof Date ? 
            bookingDetails.date.toISOString() : bookingDetails.date) : 
          null
      }));
    }
    
    console.log(`Payment details stored in session for ${referenceId}`);
  } catch (error) {
    console.error('Error storing payment details in session:', error);
  }
}

/**
 * Clear payment details from session storage
 */
export function clearPaymentDetailsFromSession(referenceId: string): void {
  try {
    sessionStorage.removeItem(`payment_id_${referenceId}`);
    sessionStorage.removeItem(`order_id_${referenceId}`);
    sessionStorage.removeItem(`amount_${referenceId}`);
    sessionStorage.removeItem(`booking_details_${referenceId}`);
    
    console.log(`Payment details cleared from session for ${referenceId}`);
  } catch (error) {
    console.error('Error clearing payment details from session:', error);
  }
}
