/**
 * Utility functions for Razorpay integration
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse, VerifyPaymentParams, SavePaymentParams } from "./razorpayTypes";
import { savePaymentDetails, forcePaymentSave } from "./paymentStorage";
import { loadRazorpayScript, isRazorpayAvailable } from "./razorpayLoader";

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
    
    // If payment is verified but no payment data is in response, try to recover it
    if (data?.success === true && data?.verified === true) {
      if (data.payment) {
        // Extract payment amount from Razorpay response (in paise)
        const amount = data.payment.amount / 100; // Convert from paise to rupees
        
        // Try to save the payment to our database
        const consultationId = data.payment.notes?.consultationId || 'auto-recovered';
        
        // Use the savePaymentDetails function
        const saveResult = await savePaymentDetails({
          paymentId,
          orderId,
          amount,
          consultationId
        });
        
        console.log(`Payment save result after verification: ${saveResult}`);
      }
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Exception verifying payment:', err);
    return false;
  }
};

/**
 * Save payment details to the database
 * Re-export from paymentStorage for backward compatibility
 */
export { savePaymentDetails };

/**
 * Verify payment by ID and update records if necessary
 */
export const verifyAndSyncPayment = async (paymentId: string): Promise<boolean> => {
  try {
    console.log("Verifying payment by ID:", paymentId);
    
    // Check if payment exists in Razorpay
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
    
    // If payment is verified but not in our database, save it
    if (data.verified && data.payment) {
      // Extract data from payment response
      const orderId = data.payment.order_id || '';
      const amount = data.payment.amount / 100; // Convert from paise to rupees
      const consultationId = data.payment.notes?.consultationId || 'recovered-payment';
      
      // Use forcePaymentSave with individual parameters (not an object)
      const saved = await forcePaymentSave(paymentId, orderId, amount, consultationId);
      
      console.log(`Recovery payment save result: ${saved}`);
      return true;
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
export type { CreateOrderParams, OrderResponse, VerifyPaymentParams, SavePaymentParams } from './razorpayTypes';
