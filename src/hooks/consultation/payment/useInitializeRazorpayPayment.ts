
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
    console.log("Starting payment process with amount:", effectivePrice);
    
    if (!effectivePrice || effectivePrice <= 0) {
      const isTestService = state.selectedServices.includes('test-service');
      const testPrice = isTestService ? 11 : 0;
      
      if (isTestService) {
        console.log("Test service detected, using fallback price:", testPrice);
      } else {
        throw new Error("Cannot process payment with zero or negative amount");
      }
      
      // Proceed with the test price
      const orderResponse = await createRazorpayOrder({
        amount: testPrice,
        receipt: receiptId,
        notes: {
          services: state.selectedServices.join(','),
          client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
          test: 'true',
        },
      });
      
      if (!orderResponse.success || !orderResponse.order) {
        throw new Error(orderResponse.error || "Failed to create order");
      }
      
      const { order, key_id } = orderResponse;
      if (setOrderId) setOrderId(order.id);
      const razorpayKey = key_id || "rzp_test_C4wVqKJiq5fXgj";
      return { order, razorpayKey };
    }
    
    // Normal flow with valid price
    const orderResponse = await createRazorpayOrder({
      amount: effectivePrice,
      receipt: receiptId,
      notes: {
        services: state.selectedServices.join(','),
        client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
      },
    });
    
    if (!orderResponse.success || !orderResponse.order) {
      throw new Error(orderResponse.error || "Failed to create order");
    }
    
    const { order, key_id } = orderResponse;
    if (setOrderId) setOrderId(order.id);
    const razorpayKey = key_id || "rzp_test_C4wVqKJiq5fXgj";
    return { order, razorpayKey };
  };
};
