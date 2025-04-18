
import { useCallback } from 'react';
import { usePaymentFlow } from './usePaymentFlow';

interface UseConsultationPaymentProps {
  state: any; // Using any for simplicity, but in a real app, define a proper interface
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment(props: UseConsultationPaymentProps) {
  // Add debug logging here to check props
  if (props.state) {
    console.log("useConsultationPayment state:", {
      selectedServices: props.state.selectedServices,
      totalPrice: props.state.totalPrice,
      pricing: props.state.pricing ? Object.fromEntries(props.state.pricing) : "No pricing map"
    });
  }
  
  const { proceedToPayment, processPayment } = usePaymentFlow(props);
  
  return {
    proceedToPayment,
    processPayment
  };
}
