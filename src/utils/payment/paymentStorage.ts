
import { supabase } from "@/integrations/supabase/client";

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  amount: number;
  consultationId: string;
  status?: string;
}

/**
 * Save payment details to the database
 */
export const savePaymentDetails = async ({
  paymentId,
  orderId,
  amount,
  consultationId,
  status = 'completed'
}: PaymentDetails): Promise<boolean> => {
  try {
    console.log("Saving payment details:", { paymentId, orderId, amount, consultationId });
    
    // Insert payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: paymentId,
        order_id: orderId,
        amount: amount,
        consultation_id: consultationId,
        status: status
      });
    
    if (paymentError) {
      console.error('Error saving payment:', paymentError);
      return false;
    }
    
    // Update consultation status
    if (consultationId) {
      const { error: consultationError } = await supabase
        .from('consultations')
        .update({ status: 'paid', payment_id: paymentId })
        .eq('reference_id', consultationId);
      
      if (consultationError) {
        console.error('Error updating consultation:', consultationError);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in savePaymentDetails:', err);
    return false;
  }
};

/**
 * Check if a payment record exists
 */
export const checkPaymentExists = async (paymentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('payment_id')
      .eq('payment_id', paymentId)
      .single();
    
    return error ? false : !!data;
  } catch (err) {
    console.error('Error in checkPaymentExists:', err);
    return false;
  }
};
