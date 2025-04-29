/**
 * Utility functions for payment services
 */
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

/**
 * Service category utilities
 */

/**
 * Determine service category from consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  if (!consultationType) return 'mental-health'; // Default category
  
  const lowerType = consultationType.toLowerCase();
  
  if (lowerType.includes('legal') || lowerType.includes('divorce') || lowerType.includes('lawyer')) {
    return 'legal';
  } else if (lowerType.includes('holistic') || lowerType.includes('comprehensive')) {
    return 'holistic';
  } else {
    return 'mental-health';
  }
}

/**
 * Other service utilities can be added here if needed
 */

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
