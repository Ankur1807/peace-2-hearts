
import { supabase } from "@/integrations/supabase/client";
import { SavePaymentParams } from "./razorpayTypes";

/**
 * Save payment details to the database
 */
export const savePaymentDetails = async (params: SavePaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, amount, consultationId } = params;
    
    console.log("Saving payment details:", { paymentId, orderId, amount, consultationId });
    
    // Insert payment record into payments table
    const { data, error } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        order_id: orderId,
        amount: amount,
        consultation_id: consultationId,
        status: 'completed'
      });
    
    if (error) {
      console.error('Error saving payment details:', error);
      return false;
    }
    
    console.log("Payment details saved successfully:", data);
    
    // Update consultation status if the consultation ID exists
    if (consultationId) {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ status: 'paid', payment_id: paymentId })
        .eq('reference_id', consultationId);
      
      if (updateError) {
        console.error('Error updating consultation status:', updateError);
        // We still consider payment saved even if consultation update fails
      } else {
        console.log("Consultation status updated successfully");
      }
    }
    
    return true;
  } catch (err) {
    console.error('Exception saving payment details:', err);
    return false;
  }
};

// This is a separate implementation to avoid recursive type issues
const savePaymentDirectly = async (
  paymentId: string,
  orderId: string,
  amount: number,
  consultationId: string
): Promise<boolean> => {
  try {
    console.log("Direct saving payment details:", { paymentId, orderId, amount, consultationId });
    
    // Insert payment record into payments table
    const { data, error } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        order_id: orderId,
        amount: amount,
        consultation_id: consultationId,
        status: 'completed'
      });
    
    if (error) {
      console.error('Error directly saving payment details:', error);
      return false;
    }
    
    console.log("Payment details directly saved successfully:", data);
    
    // Update consultation status if the consultation ID exists
    if (consultationId) {
      const { error: updateError } = await supabase
        .from('consultations')
        .update({ status: 'paid', payment_id: paymentId })
        .eq('reference_id', consultationId);
      
      if (updateError) {
        console.error('Error updating consultation status in direct save:', updateError);
      } else {
        console.log("Consultation status updated successfully in direct save");
      }
    }
    
    return true;
  } catch (err) {
    console.error('Exception in direct payment save:', err);
    return false;
  }
};

/**
 * Force save payment details even when previous attempts failed
 * This is a fallback mechanism for reconciliation
 */
export const forcePaymentSave = async (
  paymentId: string, 
  orderId: string, 
  amount: number, 
  consultationId: string
): Promise<boolean> => {
  try {
    // Check if the payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .single();
    
    if (existingPayment) {
      console.log("Payment already exists:", existingPayment);
      return true; // Already saved
    }
    
    // Use direct function call with separate parameters to avoid type recursion
    return await savePaymentDirectly(paymentId, orderId, amount, consultationId);
  } catch (err) {
    console.error('Exception in forcePaymentSave:', err);
    return false;
  }
};

/**
 * Check if payment record exists
 */
export const checkPaymentExists = async (paymentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('payment_id')
      .eq('payment_id', paymentId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception in checkPaymentExists:', err);
    return false;
  }
};
