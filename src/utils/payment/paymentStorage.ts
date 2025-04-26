
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
    
    const { error } = await supabase.from('payments').insert({
      transaction_id: paymentId,
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
