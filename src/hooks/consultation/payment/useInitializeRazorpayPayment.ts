
import { createRazorpayOrder } from '@/utils/payment/services/paymentOrderService';
import { useToast } from '@/hooks/use-toast';

interface InitializeRazorpayArgs {
  getEffectivePrice: () => number;
  state: any;
  setOrderId?: (id: string | null) => void;
  toast?: any;
}

export const useInitializeRazorpayPayment = ({
  getEffectivePrice,
  state,
  setOrderId,
  toast
}: InitializeRazorpayArgs) => {
  const internalToast = useToast?.() || { toast: () => {} };
  
  return async (receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    console.log("Starting payment process with calculated amount:", effectivePrice);
    
    // Ensure we always have a valid positive amount
    const validAmount = effectivePrice > 0 ? effectivePrice : 1500;
    console.log("Using payment amount:", validAmount);
    
    try {
      // Create order with validated price
      const orderResponse = await createRazorpayOrder(
        receiptId,
        validAmount,
        state.selectedServices?.join(',') || 'consultation'
      );
      
      if (!orderResponse || !orderResponse.id) {
        console.error("Order creation failed:", orderResponse);
        const errorMessage = "Failed to create order";
        
        if (toast) {
          toast({
            title: "Payment Initialization Failed",
            description: errorMessage,
            variant: "destructive"
          });
        } else if (internalToast.toast) {
          internalToast.toast({
            title: "Payment Initialization Failed", 
            description: errorMessage,
            variant: "destructive"
          });
        }
        
        throw new Error(errorMessage);
      }
      
      // Use the order_id from the response
      const orderId = orderResponse.id;
      if (setOrderId) setOrderId(orderId);
      
      // Extract order details and key_id
      const order = { 
        id: orderId, 
        amount: validAmount, 
        currency: 'INR' 
      };
      
      const razorpayKey = orderResponse.razorpayKey;
      
      if (!razorpayKey) {
        const errorMessage = "Razorpay key not configured. Please contact support.";
        
        if (toast) {
          toast({
            title: "Payment Configuration Error",
            description: errorMessage,
            variant: "destructive"
          });
        } else if (internalToast.toast) {
          internalToast.toast({
            title: "Payment Configuration Error", 
            description: errorMessage,
            variant: "destructive"
          });
        }
        
        throw new Error(errorMessage);
      }
      
      console.log("Payment initialized successfully with order ID:", orderId);
      
      return { order, razorpayKey };
    } catch (err) {
      console.error("Error during payment initialization:", err);
      
      // Provide detailed error information for debugging
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Unknown error during payment initialization";
      
      if (toast) {
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive"
        });
      } else if (internalToast.toast) {
        internalToast.toast({
          title: "Payment Error", 
          description: errorMessage,
          variant: "destructive"
        });
      }
      
      throw err;
    }
  };
};
