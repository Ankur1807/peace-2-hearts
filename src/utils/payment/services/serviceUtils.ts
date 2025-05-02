import { supabase } from '@/integrations/supabase/client';
import { getServiceCategoryFromId } from '@/utils/consultation/serviceIdMapper';

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
 * Determine service category from consultation type
 */
export function determineServiceCategory(consultationType: string | null | undefined): string {
  if (!consultationType) return '';
  
  // For multiple services, split by comma
  const services = consultationType.split(',');
  
  // Get the service category for each service
  const categories = new Set(services.map(getServiceCategoryFromId));
  
  // If there are multiple service categories, return 'holistic'
  if (categories.size > 1) return 'holistic';
  
  // Otherwise return the single category or default
  return Array.from(categories)[0] || 'unknown';
}
