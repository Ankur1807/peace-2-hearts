
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

interface OrderResponse {
  success: boolean;
  order?: {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
    notes?: Record<string, string>;
  };
  key_id?: string; // Add key_id to response type
  error?: string;
  details?: any;
}

interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
}

/**
 * Loads Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      // If Razorpay is already loaded, resolve immediately
      if (window.Razorpay) {
        console.log("Razorpay already loaded in window object");
        resolve(true);
        return;
      }
      
      // If script tag is already present, wait for it to load
      const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existingScript) {
        console.log("Razorpay script tag already exists, waiting for load");
        existingScript.addEventListener('load', () => {
          console.log("Existing Razorpay script loaded");
          resolve(true);
        });
        existingScript.addEventListener('error', () => {
          console.error("Failed to load existing Razorpay script");
          resolve(false);
        });
        return;
      }
      
      // Create and load script dynamically
      console.log("Dynamically loading Razorpay script");
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log("Razorpay script loaded dynamically");
        resolve(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay script dynamically");
        resolve(false);
      };
      document.body.appendChild(script);
    } else {
      resolve(false);
    }
  });
};

/**
 * Creates a new Razorpay order via Supabase Edge Function
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = params;
    
    console.log("Creating Razorpay order with params:", { amount, currency, receipt, notes });
    
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
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
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
 * Verifies a Razorpay payment via Supabase Edge Function
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
 * Saves payment details to the database
 */
export const savePaymentDetails = async (
  paymentId: string, 
  orderId: string, 
  amount: number,
  consultationId: string
): Promise<boolean> => {
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

// Check if Razorpay is available in window
export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Razorpay;
};

// Make sure we have the global Razorpay type defined
declare global {
  interface Window {
    Razorpay: any;
  }
}
