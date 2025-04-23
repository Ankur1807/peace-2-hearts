
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
      throw new Error("Cannot process payment with zero or negative amount");
    }
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
