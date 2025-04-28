
/**
 * Utility for storing payment details in session storage for potential recovery
 */
import { BookingDetails } from '@/utils/types';

/**
 * Store payment details in session storage
 */
export function storePaymentDetailsInSession(params: {
  referenceId: string;
  paymentId: string;
  amount: number;
  orderId: string;
  bookingDetails?: BookingDetails;
}): void {
  try {
    const { referenceId, paymentId, amount, orderId, bookingDetails } = params;
    
    // Store essential payment details
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    sessionStorage.setItem(`amount_${referenceId}`, amount.toString());
    
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
 * Get payment details from session storage
 */
export function getPaymentDetailsFromSession(referenceId: string): {
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  bookingDetails: any | null;
} {
  try {
    const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
    const orderId = sessionStorage.getItem(`order_id_${referenceId}`);
    const amountStr = sessionStorage.getItem(`amount_${referenceId}`);
    const bookingDetailsStr = sessionStorage.getItem(`booking_details_${referenceId}`);
    
    const amount = amountStr ? parseFloat(amountStr) : 0;
    const bookingDetails = bookingDetailsStr ? JSON.parse(bookingDetailsStr) : null;
    
    return { paymentId, orderId, amount, bookingDetails };
  } catch (error) {
    console.error('Error retrieving payment details from session:', error);
    return { paymentId: null, orderId: null, amount: 0, bookingDetails: null };
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
