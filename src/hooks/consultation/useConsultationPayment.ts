
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
    
    // Check if the price is valid
    if (effectivePrice <= 0) {
      toast({
        title: "Unable to process payment",
        description: "The calculated amount is invalid. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    // Proceed with payment processing
    processPayment();
  }, [state, processPayment, toast, getEffectivePrice]);

  return {
    proceedToPayment,
    processPayment: handleProcessPayment
  };
}
