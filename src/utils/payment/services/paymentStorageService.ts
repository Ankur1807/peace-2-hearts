
/**
 * Service for handling payment storage in sessionStorage
 */

/**
 * Store payment details in sessionStorage as a backup
 */
export const storePaymentDetailsInSession = (
  referenceId: string,
  paymentId: string,
  orderId: string,
  amount: number,
  bookingDetails?: any
) => {
  try {
    // Store payment IDs for recovery purposes
    sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
    sessionStorage.setItem(`order_id_${referenceId}`, orderId);
    sessionStorage.setItem(`amount_${referenceId}`, amount.toString());
    
    // Store booking details if available
    if (bookingDetails) {
      sessionStorage.setItem(
        `booking_details_${referenceId}`, 
        JSON.stringify(bookingDetails)
      );
    }
    
    // Store timestamp for cleanup purposes
    sessionStorage.setItem(
      `payment_timestamp_${referenceId}`, 
      new Date().toISOString()
    );
    
    console.log("Payment details stored in session storage for reference ID:", referenceId);
  } catch (error) {
    console.error("Error storing payment details in session:", error);
  }
};

/**
 * Retrieve payment details from sessionStorage
 */
export const getPaymentDetailsFromSession = (referenceId: string) => {
  try {
    const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
    const orderId = sessionStorage.getItem(`order_id_${referenceId}`);
    const amountStr = sessionStorage.getItem(`amount_${referenceId}`);
    const bookingDetailsStr = sessionStorage.getItem(`booking_details_${referenceId}`);
    
    const amount = amountStr ? parseFloat(amountStr) : 0;
    const bookingDetails = bookingDetailsStr ? JSON.parse(bookingDetailsStr) : null;
    
    return {
      paymentId,
      orderId,
      amount,
      bookingDetails
    };
  } catch (error) {
    console.error("Error retrieving payment details from session:", error);
    return { paymentId: null, orderId: null, amount: 0, bookingDetails: null };
  }
};

/**
 * Clear payment details from sessionStorage after successful processing
 */
export const clearPaymentDetailsFromSession = (referenceId: string) => {
  try {
    sessionStorage.removeItem(`payment_id_${referenceId}`);
    sessionStorage.removeItem(`order_id_${referenceId}`);
    sessionStorage.removeItem(`amount_${referenceId}`);
    sessionStorage.removeItem(`booking_details_${referenceId}`);
    sessionStorage.removeItem(`payment_timestamp_${referenceId}`);
    
    console.log("Payment details cleared from session storage for reference ID:", referenceId);
  } catch (error) {
    console.error("Error clearing payment details from session:", error);
  }
};
