
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

/**
 * Determine the service category based on the consultation type
 */
export const determineServiceCategory = (consultationType: string): string => {
  // Convert to lowercase for consistent matching
  const type = consultationType.toLowerCase();
  
  // Check for mental health services
  if (
    type.includes('therapy') ||
    type.includes('counseling') ||
    type.includes('counselling') ||
    type.includes('mental-health') ||
    type.includes('psychological') ||
    type.includes('psychotherapy')
  ) {
    return 'mental-health';
  }
  
  // Check for holistic packages
  if (
    type.includes('package') ||
    type.includes('holistic') ||
    type.includes('comprehensive')
  ) {
    return 'holistic';
  }
  
  // Default to legal services
  return 'legal';
};
