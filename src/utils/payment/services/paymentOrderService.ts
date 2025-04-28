
/**
 * Service for handling Razorpay order creation
 */
import { supabase } from "@/integrations/supabase/client";
import { CreateOrderParams, OrderResponse } from "../razorpayTypes";

/**
 * Create a new Razorpay order
 */
export const createRazorpayOrder = async (params: CreateOrderParams): Promise<OrderResponse> => {
  try {
    const { amount, currency = 'INR', receipt, notes } = params;
    
    if (!amount || amount <= 0) {
      console.error('Invalid amount for order creation:', amount);
      return { 
        success: false, 
        error: 'Invalid amount. Must be greater than zero.' 
      };
    }
    
    console.log("Creating Razorpay order with params:", { 
      amount, 
      currency, 
      receipt, 
      notes
    });
    
    // Send a numeric amount to the edge function
    // The edge function will handle conversion to paise
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'create_order',
        amount: Number(amount),
        currency,
        receipt,
        orderData: { notes }
      }
    });
    
    if (error) {
      console.error('Error invoking Razorpay edge function:', error);
      return { 
        success: false, 
        error: `Edge function error: ${error.message || 'Unknown error'}` 
      };
    }
    
    console.log("Razorpay order response:", data);
    
    if (!data?.success) {
      console.error('Razorpay order creation failed:', data?.error || 'Unknown error');
      return { 
        success: false, 
        error: data?.error || 'Failed to create payment order'
      };
    }
    
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
