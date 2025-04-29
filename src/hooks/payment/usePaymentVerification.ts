
import { useState } from 'react';
import { verifyPaymentAndCreateBooking } from '@/utils/payment/verificationService';
import { BookingDetails } from '@/utils/types';

interface UsePaymentVerificationProps {
  handleConfirmBooking?: () => Promise<void>;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  referenceId?: string;
  amount?: number;
  bookingDetails?: BookingDetails;
}

export const usePaymentVerification = ({
  setIsProcessing,
  setPaymentCompleted,
  paymentId,
  orderId,
  signature,
  referenceId,
  amount,
  bookingDetails
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ 
    success: boolean; 
    verified: boolean;
    error?: string;
  } | null>(null);

  // If we have direct payment details, verify automatically
  useState(() => {
    if (paymentId && orderId && signature && referenceId && amount && bookingDetails) {
      verifyPayment({
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature
      }, amount, bookingDetails, referenceId);
    }
  }, [paymentId, orderId, signature, referenceId, amount, bookingDetails]);

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
      setVerificationResult(verificationResult);
      
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

  return { verifyPayment, isVerifying, verificationResult };
};
