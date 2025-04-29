
import { supabase } from '@/integrations/supabase/client';

/**
 * Determine the service category based on consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  if (!consultationType) return 'unknown';
  
  if (consultationType.includes('divorce-prevention') || 
      consultationType.includes('pre-marriage-clarity') ||
      consultationType.includes('holistic')) {
    return 'holistic';
  }
  
  if (consultationType.includes('legal') || 
      consultationType.includes('divorce') || 
      consultationType.includes('marriage-law')) {
    return 'legal';
  }
  
  if (consultationType.includes('therapy') || 
      consultationType.includes('counseling') || 
      consultationType.includes('mental-health')) {
    return 'mental-health';
  }
  
  return 'general';
}

/**
 * Update consultation status in the database
 */
export async function updateConsultationStatus(
  referenceId: string,
  status: string,
  paymentId?: string,
  amount?: number,
  orderId?: string
): Promise<boolean> {
  try {
    console.log(`Updating consultation status: ${referenceId} -> ${status}`);
    
    const updateData: Record<string, any> = { status };
    
    if (paymentId) {
      updateData.payment_id = paymentId;
    }
    
    if (amount !== undefined) {
      updateData.amount = amount;
    }
    
    if (orderId) {
      updateData.order_id = orderId;
    }
    
    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('reference_id', referenceId);
    
    if (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
    
    console.log(`Successfully updated consultation ${referenceId} status to ${status}`);
    return true;
  } catch (error) {
    console.error("Exception updating consultation status:", error);
    return false;
  }
}
