
import { supabase } from '@/integrations/supabase/client';

/**
 * @deprecated This function is deprecated and should not be used.
 * All consultation status updates should be done through edge functions.
 */
export const updateConsultationStatus = async (
  referenceId: string,
  newStatus: string,
  paymentId?: string,
  amount?: number,
  orderId?: string
): Promise<boolean> => {
  console.warn("updateConsultationStatus is deprecated - all status updates should be done through edge functions");
  
  // Edge function will handle the database operations
  return true;
};
