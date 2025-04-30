
import { supabase } from '@/integrations/supabase/client';
import { CreateOrderParams, OrderResponse } from '../razorpayTypes';

/**
 * Create a new Razorpay order
 */
export async function createRazorpayOrder(
  receiptId: string,
  amount: number,
  consultationType: string
): Promise<OrderResponse> {
  try {
    console.log(`Creating Razorpay order for ${receiptId} with amount ${amount}`);
    
    // Call the edge function to create an order
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'create_order', // Consistent action naming
        amount,
        receipt: receiptId,
        notes: {
          'consultationType': consultationType
        }
      }
    });
    
    if (error) {
      console.error("Error creating Razorpay order:", error);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
    
    if (!data || !data.id) {
      throw new Error("Invalid response from order creation");
    }
    
    console.log("Order created successfully:", data);
    
    // Return the data with success flag
    return {
      ...data,
      success: true,
      order_id: data.id,
      razorpayKey: data.razorpayKey || '',
      order: {
        id: data.id
      }
    };
  } catch (error) {
    console.error("Error in createRazorpayOrder:", error);
    throw error;
  }
}
