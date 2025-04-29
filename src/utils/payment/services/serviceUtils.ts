/**
 * Utility functions for payment services
 */
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

/**
 * Determine the service category based on the consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  if (!consultationType) return 'mental-health';
  
  const lowerConsultation = consultationType.toLowerCase();
  
  if (lowerConsultation.includes('legal') || 
      lowerConsultation.includes('divorce') || 
      lowerConsultation.includes('custody')) {
    return 'legal';
  }
  
  if (lowerConsultation.includes('holistic') || 
      lowerConsultation.includes('package') ||
      lowerConsultation.includes('prevention')) {
    return 'holistic';
  }
  
  return 'mental-health';
}

/**
 * Update the consultation status in the database
 */
export async function updateConsultationStatus(
  referenceId: string, 
  status: string, 
  paymentId?: string,
  amount?: number,
  orderId?: string
): Promise<boolean> {
  try {
    console.log(`Updating consultation status for ${referenceId} to ${status}`);
    
    let updateData: any = { 
      payment_status: status,
      updated_at: new Date().toISOString()
    };
    
    // Only update these fields if they're provided
    if (paymentId) updateData.payment_id = paymentId;
    if (amount !== undefined) updateData.amount = amount;
    if (orderId) updateData.order_id = orderId;
    
    // For completed payments, update status to confirmed
    if (status === 'completed' || status === 'paid') {
      updateData.status = 'confirmed';
    }
    
    // Update the consultation record
    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('reference_id', referenceId);
    
    if (error) {
      console.error(`Error updating consultation status: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception updating consultation status: ${error}`);
    return false;
  }
}

/**
 * Create a booking email for payment verification
 */
export function createEmailForPayment(
  bookingDetails: BookingDetails, 
  paymentId: string, 
  amount: number
): {
  success: boolean;
  emailRecord?: any;
} {
  // Implementation would be here
  return { success: false };
}
