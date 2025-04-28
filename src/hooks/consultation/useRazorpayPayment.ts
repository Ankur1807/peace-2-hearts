import { useEffectivePrice } from './payment/useEffectivePrice';
import { useInitializeRazorpayPayment } from './payment/useInitializeRazorpayPayment';
import { useOpenRazorpayCheckout } from './payment/useOpenRazorpayCheckout';
import { verifyPaymentAndCreateBooking } from '@/utils/payment/verificationService';

interface RazorpayPaymentProps {
  state: any;
  toast: any;
  setIsProcessing: (isProcessing: boolean) => void;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  handleConfirmBooking?: () => Promise<void>;
}

export function useRazorpayPayment({
  state,
  toast,
  setIsProcessing,
  setOrderId,
  setPaymentCompleted,
  setReferenceId,
  handleConfirmBooking,
}: RazorpayPaymentProps) {
  const getEffectivePrice = useEffectivePrice({
    selectedServices: state.selectedServices,
    pricing: state.pricing,
    totalPrice: state.totalPrice
  });

  const initializeRazorpayPayment = useInitializeRazorpayPayment({
    getEffectivePrice,
    state,
    setOrderId,
  });

  const openRazorpayCheckout = useOpenRazorpayCheckout({
    getEffectivePrice,
    state,
    setIsProcessing,
    setPaymentCompleted,
    setReferenceId,
    toast,
    verifyPaymentAndCreateBooking
  });

  return {
    initializeRazorpayPayment,
    openRazorpayCheckout,
  };
}
