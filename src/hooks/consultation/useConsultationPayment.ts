
import { useCallback } from 'react';
import { usePaymentFlow } from './usePaymentFlow';

interface UseConsultationPaymentProps {
  state: any;
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setOrderId?: (id: string | null) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment(props: UseConsultationPaymentProps) {
  const { proceedToPayment, processPayment } = usePaymentFlow(props);
  
  return {
    proceedToPayment,
    processPayment
  };
}
