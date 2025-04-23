
/**
 * Utility functions for Razorpay integration
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse, VerifyPaymentParams } from "./razorpayTypes";

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
    return data?.success === true && data?.verified === true;
  } catch (err) {
    console.error('Exception verifying payment:', err);
    return false;
  }
};

/**
 * Save payment details to the database
 */
export const savePaymentDetails = async (params: SavePaymentParams): Promise<boolean> => {
  try {
    const { paymentId, orderId, amount, consultationId } = params;
    
    console.log("Saving payment details:", { paymentId, orderId, amount, consultationId });
    
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
