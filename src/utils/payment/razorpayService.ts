
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
    notes?: Record<string, string>; // Added notes property to fix the TypeScript error
  };
  error?: string;
  details?: any;
}

interface VerifyPaymentParams {
  paymentId: string;
  orderId: string;
  signature: string;
}

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
    
    console.log("Verifying payment:", { paymentId, orderId });
    
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
    return data?.verified === true;
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

// Make sure we have the global Razorpay type defined
declare global {
  interface Window {
    Razorpay: any;
  }
}
