
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
    console.log(`Processing payment with effective price: ${effectivePrice}`, {
      selectedServices: state.selectedServices,
      pricing: state.pricing ? Object.fromEntries(state.pricing) : {},
      totalPrice: state.totalPrice
    });
    
    // Check if the price is valid
    if (effectivePrice <= 0) {
      console.error("Invalid price detected:", effectivePrice);
      toast({
        title: "Price Error",
        description: "Unable to determine price for the selected service. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    // Set the calculated price to totalPrice for the state
    if (state.setTotalPrice) {
      state.setTotalPrice(effectivePrice);
      console.log(`Updated totalPrice state to: ${effectivePrice}`);
    }
    
    // Proceed with payment processing
    console.log("Calling processPayment function");
    processPayment();
  }, [state, processPayment, toast, getEffectivePrice]);

  return {
    proceedToPayment,
    processPayment: handleProcessPayment
  };
}
