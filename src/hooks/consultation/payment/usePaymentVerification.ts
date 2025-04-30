
import { useState } from 'react';
import { verifyPaymentAndCreateBooking } from '@/utils/payment/verificationService';
import { BookingDetails, VerificationResult } from '@/utils/types';

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
      
      console.log("[VERIFY] Starting payment verification process", { 
        paymentId: response.razorpay_payment_id,
        referenceId: referenceId,
      });
      
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
      
      console.log("[VERIFY] Payment verification completed with result:", verificationResult);
      
      if (verificationResult.success && verificationResult.verified) {
        console.log("[VERIFY] Payment verified successfully, marking as completed");
        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }
        return { 
          success: true, 
          verified: true, 
          redirectUrl: verificationResult.redirectUrl || '/thank-you'
        } as VerificationResult;
      }
      
      console.warn("[VERIFY] Payment verification failed:", verificationResult);
      return { success: false, verified: false } as VerificationResult;
    } catch (error) {
      console.error("[VERIFY] Error in verifyPayment:", error);
      return { success: false, verified: false, error } as VerificationResult;
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  return { verifyPayment, isVerifying };
};
