
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
      // Normal flow with validated price
      const orderResponse = await createRazorpayOrder({
        amount: validAmount,
        receipt: receiptId,
        notes: {
          services: state.selectedServices.join(','),
          client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
          test: state.selectedServices.includes('test-service') ? 'true' : 'false',
        },
      });
      
      if (!orderResponse.success || !orderResponse.order) {
        console.error("Order creation failed:", orderResponse.error);
        throw new Error(orderResponse.error || "Failed to create order");
      }
      
      const { order, key_id } = orderResponse;
      if (setOrderId) setOrderId(order.id);
      
      // Use the returned key or fallback to test key
      const razorpayKey = key_id || "rzp_test_C4wVqKJiq5fXgj";
      console.log("Payment initialized successfully with order ID:", order.id);
      
      return { order, razorpayKey };
    } catch (err) {
      console.error("Error during payment initialization:", err);
      throw err;
    }
  };
};
