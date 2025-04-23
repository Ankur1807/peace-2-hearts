
/**
 * Utility functions for Razorpay integration
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse, VerifyPaymentParams } from "./razorpayTypes";
import { savePaymentDetails, forcePaymentSave } from "./paymentStorage";

// Type definition for SavePaymentParams
export interface SavePaymentParams {
  paymentId: string;
  orderId: string;
  amount: number;
  consultationId: string;
}

// Check if Razorpay script is already loaded
export const isRazorpayAvailable = (): boolean => {
  console.log("Razorpay already available", typeof window !== 'undefined' && window.Razorpay !== undefined);
  return typeof window !== 'undefined' && window.Razorpay !== undefined;
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isRazorpayAvailable()) {
      console.log('Razorpay is already loaded');
      resolve(true);
      return;
    }

    console.log('Attempting to load Razorpay script...');
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Initialize Razorpay checkout
export const initRazorpayCheckout = (options: any) => {
  if (!isRazorpayAvailable()) {
    console.error('Razorpay not loaded');
    return null;
  }
  
  try {
    return new window.Razorpay(options);
  } catch (error) {
    console.error('Failed to initialize Razorpay:', error);
    return null;
  }
};

/**
 * Create a new Razorpay order
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = params;
    
    // Ensure amount is valid, default to 11 for test service
    const effectiveAmount = amount <= 0 && notes?.test === 'true' ? 11 : amount;
    
    console.log("Creating Razorpay order with params:", { 
      amount: effectiveAmount, 
      currency, 
      receipt, 
      notes,
      isTestService: notes?.test === 'true'
    });
    
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: JSON.stringify({
        action: 'create_order',
        amount: effectiveAmount,
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
      details: err instanceof Error ? err.message : String(err)
    };
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyRazorpayPayment = async (params: VerifyPaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, signature } = params;
    
    console.log("Verifying payment:", { paymentId, orderId, signature: signature ? "provided" : "missing" });
    
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
    
    console.log("Payment verification response:", data);
    
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
export { savePaymentDetails, forcePaymentSave };

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
      
      // Use forcePaymentSave for maximum reliability
      const saved = await forcePaymentSave({
        paymentId,
        orderId,
        amount,
        consultationId
      });
      
      console.log(`Recovery payment save result: ${saved}`);
      return true;
    }
    
    return data.verified || false;
  } catch (err) {
    console.error('Exception in verifyAndSyncPayment:', err);
    return false;
  }
};

