
import { createRazorpayOrder } from '@/utils/payment/razorpayService';

interface InitializeRazorpayArgs {
  getEffectivePrice: () => number;
  state: any;
  setOrderId?: (id: string | null) => void;
}

export const useInitializeRazorpayPayment = ({
  getEffectivePrice,
  state,
  setOrderId
}: InitializeRazorpayArgs) => {
  return async (receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    console.log("Starting payment process with calculated amount:", effectivePrice);
    
    // Ensure we always have a valid positive amount
    const validAmount = effectivePrice > 0 ? effectivePrice : 1500;
    console.log("Using payment amount:", validAmount);
    
    try {
      // Create order with validated price
      const orderResponse = await createRazorpayOrder({
        amount: validAmount,
        receipt: receiptId,
        notes: {
          services: state.selectedServices.join(','),
          client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
        },
      });
      
      if (!orderResponse.success || !orderResponse.order_id) {
        console.error("Order creation failed:", orderResponse.error);
        throw new Error(orderResponse.error || "Failed to create order");
      }
      
      // Use the order_id from the response
      const orderId = orderResponse.order_id;
      if (setOrderId) setOrderId(orderId);
      
      // Extract order details and key_id
      const order = orderResponse.details || { id: orderId, amount: validAmount, currency: 'INR' };
      const razorpayKey = orderResponse.details?.key_id;
      
      if (!razorpayKey) {
        throw new Error("Razorpay key not configured. Please contact support.");
      }
      
      console.log("Payment initialized successfully with order ID:", orderId);
      
      return { order, razorpayKey };
    } catch (err) {
      console.error("Error during payment initialization:", err);
      throw err;
    }
  };
};
