
/**
 * Utility functions for payment service
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Determine service category from consultation type
 */
export function determineServiceCategory(consultationType: string): string {
  if (!consultationType) return 'mental-health';
  
  const lowerCaseType = consultationType.toLowerCase();
  
  if (lowerCaseType.includes('legal') || lowerCaseType.includes('divorce')) {
    return 'legal';
  } else if (lowerCaseType.includes('holistic')) {
    return 'holistic';
  } else {
    return 'mental-health';
  }
}

/**
 * Update the status and payment information of a consultation
 */
export async function updateConsultationStatus(
  consultationId: string, 
  status: string,
  paymentId?: string,
  amount?: number,
  orderId?: string
): Promise<boolean> {
  try {
    // First check if consultationId is a UUID or a reference_id
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(consultationId);
    
    // Prepare update data
    const updateData: any = { 
      status: status === 'completed' ? 'paid' : status 
    };
    
    // Add payment information if provided
    if (paymentId) {
      updateData.payment_id = paymentId;
    }
    
    if (amount) {
      updateData.amount = amount;
    }
    
    if (orderId) {
      updateData.order_id = orderId;
    }
    
    if (status === 'paid' || status === 'completed') {
      updateData.payment_status = 'completed';
    }
    
    // Proceed with the update
    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq(isUuid ? 'id' : 'reference_id', consultationId);
    
    if (error) {
      console.error("Error updating consultation status:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception updating consultation status:", error);
    return false;
  }
}

/**
 * Get consultation data by reference ID
 */
export async function getConsultationByReferenceId(referenceId: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception fetching consultation:", error);
    return null;
  }
}

/**
 * Check if consultation has payment information
 */
export async function hasPaymentInformation(consultationId: string): Promise<boolean> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(consultationId);
    
    const { data, error } = await supabase
      .from('consultations')
      .select('payment_id, payment_status')
      .eq(isUuid ? 'id' : 'reference_id', consultationId)
      .single();
    
    if (error) {
      console.log("Error checking payment information:", error.message);
      return false;
    }
    
    if (!data) {
      return false;
    }
    
    // Check for payment fields safely
    const hasPaymentId = data.payment_id !== undefined && data.payment_id !== null;
    const hasPaymentStatus = data.payment_status !== undefined && data.payment_status === 'completed';
    
    return hasPaymentId || hasPaymentStatus;
  } catch (error) {
    console.error("Exception checking payment information:", error);
    return false;
  }
}
