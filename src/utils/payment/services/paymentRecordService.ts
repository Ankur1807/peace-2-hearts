
import { supabase } from '@/integrations/supabase/client';
import { updateConsultationStatus } from './serviceUtils';
import { BookingDetails } from '@/utils/types';

interface SavePaymentParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  bookingDetails?: any;
  status?: string;
}

/**
 * Store payment information in consultations table 
 * (without adding a separate payments record)
 */
export const savePaymentRecord = async (params: SavePaymentParams): Promise<boolean> => {
  try {
    console.log(`Saving payment record for ${params.referenceId}`);
    
    // Update the consultation record instead of creating a separate payment record
    const consultationUpdated = await updateConsultationStatus(
      params.referenceId,
      'paid',
      params.paymentId,
      params.amount,
      params.orderId
    );
    
    if (!consultationUpdated) {
      console.error(`Failed to update consultation ${params.referenceId}`);
    }
    
    console.log(`Payment record saved successfully for ${params.referenceId}`);
    return consultationUpdated;
  } catch (error) {
    console.error(`Error in savePaymentRecord for ${params.referenceId}:`, error);
    return false;
  }
};

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
