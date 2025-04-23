
/**
 * Utilities for storing payment details
 */
import { supabase } from "@/integrations/supabase/client";
import { SavePaymentParams } from "./razorpayTypes";

/**
 * Saves payment details to the database
 */
export const savePaymentDetails = async (params: SavePaymentParams): Promise<boolean> => {
  const { paymentId, orderId, amount, consultationId } = params;
  
  try {
    console.log("Saving payment details:", { paymentId, orderId, amount, consultationId });
    
    // First check if payment record already exists to avoid duplicates
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('transaction_id', paymentId)
      .single();
    
    if (existingPayment) {
      console.log("Payment already exists in database:", existingPayment);
      return true; // Already saved
    }
    
    const { error } = await supabase.from('payments').insert({
      transaction_id: paymentId,
      order_id: orderId,
      consultation_id: consultationId,
      amount: amount,
      payment_status: 'completed',
      payment_method: 'razorpay',
      currency: 'INR'
    });
    
    if (error) {
      console.error('Error saving payment details:', error);
      return false;
    }
    
    console.log("Payment details saved successfully");
    return true;
  } catch (err) {
    console.error('Exception saving payment details:', err);
    return false;
  }
};

/**
 * Checks if a payment exists in the database
 */
export const checkPaymentExists = async (paymentId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('transaction_id')
      .eq('transaction_id', paymentId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error checking payment existence:', err);
    return false;
  }
};
