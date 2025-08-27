
import { useState, useEffect } from 'react';
import { usePaymentStatus } from '@/hooks/payment/usePaymentStatus';
import { BookingDetails } from '@/utils/types';

interface UsePaymentVerificationProps {
  handleConfirmBooking?: () => Promise<void>;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
}

export const usePaymentVerification = ({
  setIsProcessing,
  setPaymentCompleted,
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const { statusResult, startPolling } = usePaymentStatus({
    orderId: currentOrderId
  });

  // Monitor payment status changes
  useEffect(() => {
    if (statusResult) {
      const isVerified = statusResult.success && statusResult.status === 'captured';
      
      if (isVerified) {
        console.log("Payment captured successfully");
        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }
        setIsVerifying(false);
        setIsProcessing(false);
      } else if (statusResult.status === 'failed') {
        console.log("Payment failed");
        setIsVerifying(false);
        setIsProcessing(false);
      }
    }
  }, [statusResult, setPaymentCompleted, setIsProcessing]);

  const verifyPayment = async (response: any, amount: number, bookingDetails: BookingDetails, referenceId: string) => {
    try {
      setIsVerifying(true);
      
      console.log("Starting payment status check for order:", response.razorpay_order_id);
      
      // Set the order ID and start polling
      setCurrentOrderId(response.razorpay_order_id);
      startPolling();
      
      return { success: true, verified: false }; // Will be updated via polling
    } catch (error) {
      console.error("Error starting payment verification:", error);
      setIsVerifying(false);
      setIsProcessing(false);
      return { success: false, verified: false };
    }
  };

  return { verifyPayment, isVerifying };
};
