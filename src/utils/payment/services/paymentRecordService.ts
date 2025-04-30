
import { supabase } from '@/integrations/supabase/client';

interface SavePaymentParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  bookingDetails?: any;
  status?: string;
}

/**
 * Store payment details in session storage
 */
export function storePaymentDetailsInSession(details: SavePaymentParams): void {
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
 * Save payment record via edge function only
 * @deprecated Direct database writes are not allowed anymore, use edge functions instead
 */
export const savePaymentRecord = async (params: SavePaymentParams): Promise<boolean> => {
  console.warn("savePaymentRecord is deprecated - payments should only be processed by edge functions");
  
  // Store payment details in session for recovery purposes
  storePaymentDetailsInSession(params);
  
  // The verify-payment edge function should handle the database operations
  return true;
};
