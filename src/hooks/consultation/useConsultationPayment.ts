
import { useCallback } from 'react';
import { usePaymentFlow } from './usePaymentFlow';
import { useToast } from '@/hooks/use-toast';

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
  const { proceedToPayment, processPayment } = usePaymentFlow({
    state,
    toast,
    setIsProcessing,
    setShowPaymentStep,
    handleConfirmBooking,
    setReferenceId
  });

  const handleProcessPayment = useCallback(() => {
    // Check if test service is selected
    const isTestService = state.selectedServices.includes('test-service');
    
    // Calculate effective price for payment
    let calculatedPrice = state.totalPrice;
    
    if (isTestService) {
      // Get price from pricing map or use fallback
      calculatedPrice = state.pricing?.get('test-service') || 11;
      console.log(`Payment using test service price: ${calculatedPrice}`);
    } else {
      console.log(`Payment using total price: ${calculatedPrice}`);
    }
    
    // Log the processing with calculated price
    console.log(`Processing payment with calculated price: ${calculatedPrice}`);
    
    // Process payment with validation
    if (calculatedPrice <= 0 && !isTestService) {
      toast({
        title: "Unable to process payment",
        description: "The calculated amount is invalid. Please try again or contact support.",
        variant: "destructive"
      });
      return;
    }
    
    // Proceed with payment processing
    processPayment();
  }, [state, processPayment, toast]);

  return {
    proceedToPayment,
    processPayment: handleProcessPayment
  };
}
