
import { useRazorpayInit } from './useRazorpayInit';
import { useCheckoutOptions } from './useCheckoutOptions';
import { usePaymentNavigation } from './usePaymentNavigation';

interface OpenRazorpayCheckoutArgs {
  getEffectivePrice: () => number;
  state: any;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  toast: any;
}

export const useOpenRazorpayCheckout = ({
  getEffectivePrice,
  state,
  setIsProcessing,
  setPaymentCompleted,
  setReferenceId,
  toast,
}: OpenRazorpayCheckoutArgs) => {
  const { initializeRazorpay } = useRazorpayInit();
  const { createCheckoutOptions } = useCheckoutOptions();
  const { navigateToVerification, handlePaymentError } = usePaymentNavigation();
  
  return async (order: any, razorpayKey: string, receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    console.log("Opening Razorpay checkout with reference ID:", receiptId);
    
    if (setReferenceId) {
      setReferenceId(receiptId);
    }
    
    const bookingDetails = {
      clientName: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
      email: state.personalDetails.email,
      referenceId: receiptId,
      consultationType: state.selectedServices.length > 1 ? 'multiple' : state.selectedServices[0],
      services: state.selectedServices || [],
      date: state.serviceCategory === 'holistic' ? undefined : state.date,
      timeSlot: state.serviceCategory === 'holistic' ? undefined : state.timeSlot,
      timeframe: state.serviceCategory === 'holistic' ? state.timeframe : undefined,
      packageName: state.serviceCategory === 'holistic' ? 
        (state.selectedServices.includes('divorce-prevention') ? 'Divorce Prevention Package' : 
        state.selectedServices.includes('pre-marriage-clarity') ? 'Pre-Marriage Clarity Package' : null) : null,
      serviceCategory: state.serviceCategory,
      amount: effectivePrice,
      message: state.personalDetails.message,
      phone: state.personalDetails.phone
    };

    try {
      const isLoaded = await initializeRazorpay();
      if (!isLoaded) return;

      const options = createCheckoutOptions({
        razorpayKey,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        personalDetails: state.personalDetails,
        selectedServices: state.selectedServices,
        receiptId
      });

      const razorpay = new window.Razorpay({
        ...options,
        handler: async function (response: any) {
          console.log("Payment successful:", response);
          setIsProcessing(true);
          
          if (setPaymentCompleted) {
            setPaymentCompleted(true);
          }
          
          // Navigate to verification page that will handle the verification and booking creation
          navigateToVerification({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: effectivePrice,
            referenceId: receiptId,
            bookingDetails,
            isVerifying: true
          });
        }
      });
      
      razorpay.on("payment.failed", function (response: any) {
        handlePaymentError(
          response.error,
          response.error?.metadata?.payment_id || '',
          order.id,
          effectivePrice,
          receiptId,
          bookingDetails
        );
        setIsProcessing(false);
      });
      
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      setIsProcessing(false);
      throw new Error("Failed to initialize payment gateway");
    }
  };
};
