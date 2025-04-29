
import { useState } from 'react';
import { verifyPaymentAndCreateBooking } from '@/utils/payment/verificationService';
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

  const verifyPayment = async (response: any, amount: number, bookingDetails: BookingDetails, referenceId: string) => {
    try {
      setIsVerifying(true);
      
      console.log("Verifying payment with unified verification service");
      
      // Convert amount to string for verification if needed
      const amountString = amount.toString();
      
      // Use our unified verification service
      const verificationResult = await verifyPaymentAndCreateBooking(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature,
        {
          ...bookingDetails,
          referenceId,
          amount
        }
      );
      
      console.log("Payment verification result:", verificationResult);
      
      if (verificationResult.success && verificationResult.verified) {
        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }
        return { success: true, verified: true };
      }
      
      return { success: false, verified: false };
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  return { verifyPayment, isVerifying };
};
