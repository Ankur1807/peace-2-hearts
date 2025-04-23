
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
    
    // Insert the payment record with explicit columns
    const { data, error } = await supabase
      .from('payments')
      .insert({
        transaction_id: paymentId,
        order_id: orderId,
        consultation_id: consultationId,
        amount: amount,
        payment_status: 'completed',
        payment_method: 'razorpay',
        currency: 'INR'
      })
      .select();
    
    if (error) {
      console.error('Error saving payment details:', error);
      throw new Error(`Failed to save payment: ${error.message}`);
    }
    
    console.log("Payment details saved successfully:", data);
    return true;
  } catch (err) {
    console.error('Exception saving payment details:', err);
    // Try one more time with a delay
    try {
      console.log("Retrying payment save after failure...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error } = await supabase.from('payments').insert({
        transaction_id: paymentId,
        order_id: orderId,
        consultation_id: consultationId,
        amount: amount,
        payment_status: 'completed',
        payment_method: 'razorpay',
        currency: 'INR'
      });
      
      if (!error) {
        console.log("Payment details saved successfully on retry");
        return true;
      }
    } catch (retryErr) {
      console.error('Exception during payment save retry:', retryErr);
    }
    
    return false;
  }
};

/**
 * Checks if a payment exists in the database
 */
export const checkPaymentExists = async (paymentId: string): Promise<boolean> => {
  try {
    console.log("Checking if payment exists:", paymentId);
    
    const { data, error } = await supabase
      .from('payments')
      .select('transaction_id')
      .eq('transaction_id', paymentId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking payment existence:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Exception checking payment existence:', err);
    return false;
  }
};

/**
 * Forces a payment record save even if there are errors
 * Used as a fallback for payment recovery
 */
export const forcePaymentSave = async (params: SavePaymentParams): Promise<boolean> => {
  const { paymentId, orderId, amount, consultationId } = params;
  
  try {
    console.log("Force saving payment details:", { paymentId, orderId, amount, consultationId });
    
    // Check if payment already exists
    const exists = await checkPaymentExists(paymentId);
    if (exists) {
      console.log("Payment already exists in database, skipping force save");
      return true;
    }
    
    // Insert with minimal error handling
    const { error } = await supabase.from('payments').insert({
      transaction_id: paymentId,
      order_id: orderId || 'recovered-order',
      consultation_id: consultationId || 'recovered-consultation',
      amount: amount || 0,
      payment_status: 'completed',
      payment_method: 'razorpay',
      currency: 'INR'
    });
    
    if (error) {
      console.error('Error during force save of payment:', error);
      return false;
    }
    
    console.log("Payment force saved successfully");
    return true;
  } catch (err) {
    console.error('Critical failure saving payment:', err);
    return false;
  }
};
