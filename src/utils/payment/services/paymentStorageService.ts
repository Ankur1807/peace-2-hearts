
interface PaymentDetails {
  referenceId: string;
  paymentId: string;
  orderId: string;
  amount: number;
  bookingDetails?: any;
}

/**
 * Store payment details in session storage
 */
export function storePaymentDetailsInSession(details: PaymentDetails): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      // Save the main payment reference
      window.sessionStorage.setItem('lastPaymentReferenceId', details.referenceId);
      
      // Save full payment details
      const paymentKey = `payment_${details.referenceId}`;
      window.sessionStorage.setItem(paymentKey, JSON.stringify({
        referenceId: details.referenceId,
        paymentId: details.paymentId,
        orderId: details.orderId,
        amount: details.amount,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`Payment details stored in session for ${details.referenceId}`);
    }
  } catch (error) {
    console.error('Error storing payment details in session:', error);
  }
}

/**
 * Retrieve the last payment reference ID from session
 */
export function getLastPaymentReferenceId(): string | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return window.sessionStorage.getItem('lastPaymentReferenceId');
    }
    return null;
  } catch (error) {
    console.error('Error retrieving last payment reference ID:', error);
    return null;
  }
}

/**
 * Get payment details from session
 */
export function getPaymentDetailsFromSession(referenceId: string): any | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const paymentKey = `payment_${referenceId}`;
      const data = window.sessionStorage.getItem(paymentKey);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving payment details for ${referenceId}:`, error);
    return null;
  }
}
