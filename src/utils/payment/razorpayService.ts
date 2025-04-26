
/**
 * Utility functions for Razorpay integration
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse, VerifyPaymentParams } from "./razorpayTypes";
import { loadRazorpayScript, isRazorpayAvailable } from "./razorpayLoader";
import { BookingDetails } from "@/utils/types";

/**
 * Create a new Razorpay order
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = params;
    
    console.log("Creating Razorpay order with params:", { 
      amount, 
      currency, 
      receipt, 
      notes
    });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'create_order',
        amount,
        currency,
        receipt,
        orderData: { notes }
      })
    });
    
    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
    
    console.log("Razorpay order response:", data);
    return data as OrderResponse;
  } catch (err) {
    console.error('Exception creating order:', err);
    return { 
      success: false, 
      error: 'Failed to create order',
      details: err instanceof Error ? { 
        id: 'error', 
        amount: 0, 
        currency: 'INR', 
        message: err.message 
      } : { 
        id: 'error', 
        amount: 0, 
        currency: 'INR', 
        message: String(err) 
      }
    };
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyRazorpayPayment = async (params: VerifyPaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, signature } = params;
    
    console.log("Verifying Razorpay payment:", { paymentId, orderId, signature: signature ? "provided" : "missing" });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'verify_payment',
        paymentId,
        orderData: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        }
      })
    });
    
    if (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
    
    console.log("Payment verification response from Razorpay:", data);
    
    return data?.success === true && data?.verified === true;
  } catch (err) {
    console.error('Exception verifying payment:', err);
    return false;
  }
};

/**
 * Save payment record to database
 */
export const savePaymentRecord = async (params: {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  status?: string;
}): Promise<boolean> => {
  try {
    const { paymentId, orderId, amount, referenceId, status = 'completed' } = params;
    
    console.log("Saving payment record:", { paymentId, orderId, amount, referenceId });

    // First, find the consultation by reference ID
    const { data: consultationData, error: consultationError } = await supabase
      .from('consultations')
      .select('id')
      .eq('reference_id', referenceId)
      .single();
    
    if (consultationError || !consultationData) {
      console.error('Error finding consultation:', consultationError || 'No consultation found');
      return false;
    }

    const consultationId = consultationData.id;

    // Save the payment record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        consultation_id: consultationId,
        amount: amount,
        transaction_id: paymentId,
        payment_status: status,
        payment_method: 'razorpay',
      });
    
    if (error) {
      console.error('Error saving payment record:', error);
      return false;
    }

    // Update consultation status to paid
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ status: 'paid' })
      .eq('id', consultationId);
    
    if (updateError) {
      console.error('Error updating consultation status:', updateError);
      // We still return true as the payment was recorded
    }
    
    console.log("Payment record saved successfully");
    return true;
  } catch (err) {
    console.error('Exception saving payment record:', err);
    return false;
  }
};

/**
 * Complete the booking after payment
 */
export const completeBookingAfterPayment = async (
  referenceId: string, 
  bookingDetails: BookingDetails,
  paymentId: string,
  amount: number
): Promise<boolean> => {
  try {
    console.log("Completing booking after payment:", { referenceId, paymentId, amount });
    
    // Save the payment record
    await savePaymentRecord({
      paymentId,
      orderId: '', // We might not have this at this point
      amount,
      referenceId,
    });
    
    return true;
  } catch (err) {
    console.error('Exception completing booking after payment:', err);
    return false;
  }
};

/**
 * Verify payment by ID
 */
export const verifyAndSyncPayment = async (paymentId: string): Promise<boolean> => {
  try {
    console.log("Verifying payment by ID:", paymentId);
    
    // Check payment status in Razorpay
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'verify_payment',
        paymentId,
        checkOnly: true
      })
    });
    
    if (error || !data?.success) {
      console.error('Error verifying payment by ID:', error || data?.error);
      return false;
    }
    
    return data.verified || false;
  } catch (err) {
    console.error('Exception in verifyAndSyncPayment:', err);
    return false;
  }
};

// Re-export script loading utilities
export { loadRazorpayScript, isRazorpayAvailable };

// Re-export types for compatibility with existing code
export type { CreateOrderParams, OrderResponse, VerifyPaymentParams } from './razorpayTypes';
