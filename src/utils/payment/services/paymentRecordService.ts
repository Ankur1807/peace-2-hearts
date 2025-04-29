
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
      params.orderId || undefined
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

// storePaymentDetailsInSession is now imported from paymentStorageService.ts
// This function has been removed to avoid duplication
