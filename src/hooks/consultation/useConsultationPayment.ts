
import { useCallback } from 'react';
import { usePaymentFlow } from './usePaymentFlow';
import { useToast } from '@/hooks/use-toast';
import { useEffectivePrice } from './payment/useEffectivePrice';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing: (isProcessing: boolean) => void;
  setShowPaymentStep: (show: boolean) => void;
  handleConfirmBooking: () => Promise<void>;
  setReferenceId: (id: string) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing,
  setShowPaymentStep,
  handleConfirmBooking,
  setReferenceId
}: UseConsultationPaymentProps) {
  const getEffectivePrice = useEffectivePrice({
    selectedServices: state.selectedServices,
    pricing: state.pricing,
    totalPrice: state.totalPrice
  });

  const { proceedToPayment, processPayment } = usePaymentFlow({
    state,
    toast,
    setIsProcessing,
    setShowPaymentStep,
    handleConfirmBooking,
    setReferenceId
  });

  const handleProcessPayment = useCallback(() => {
    // Get the effective price using our hook
    const effectivePrice = getEffectivePrice();
    
    // Log the processing with calculated price
    console.log(`Processing payment with effective price: ${effectivePrice}`);
    
    // Check if the price is valid with a fallback
    const validPrice = effectivePrice > 0 ? effectivePrice : 1500;
    
    // Set the calculated price to totalPrice for the state
    if (state.setTotalPrice && validPrice > 0) {
      state.setTotalPrice(validPrice);
      console.log(`Updated totalPrice state to: ${validPrice}`);
    }
    
    // Always proceed with payment processing using valid price
    processPayment();
  }, [state, processPayment, toast, getEffectivePrice]);

  return {
    proceedToPayment,
    processPayment: handleProcessPayment
  };
}
