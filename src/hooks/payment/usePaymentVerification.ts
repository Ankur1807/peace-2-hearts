
import { useState, useEffect } from 'react';
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
    message?: string;
  } | null>(null);

  // If we have direct payment details, verify automatically
  useEffect(() => {
    if (paymentId && orderId && referenceId && amount && bookingDetails) {
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
      
      console.log("Verifying payment with unified verification service", {
        paymentId: response.razorpay_payment_id,
        amount,
        referenceId
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
      
      console.log("Payment verification result:", verificationResult);
      
      // Generate a user-friendly message based on verification results
      let message = "";
      if (verificationResult.success && verificationResult.verified) {
        message = "Your payment has been successfully verified. Thank you for your booking!";
      } else if (verificationResult.success && !verificationResult.verified) {
        message = "Your payment was processed, but verification failed. Our team will reach out to you for confirmation.";
      } else {
        message = verificationResult.error || "There was an issue with your payment verification. Please contact support.";
      }
      
      setVerificationResult({
        ...verificationResult,
        message
      });
      
      if (verificationResult.success && verificationResult.verified) {
        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }
        return { success: true, verified: true };
      }
      
      // Even if verification failed, we still consider the operation "successful"
      // for UX purposes, but we'll handle the error on the confirmation page
      return { success: true, verified: false };
    } catch (error) {
      console.error("Error in verifyPayment:", error);
      setVerificationResult({
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : String(error),
        message: "An unexpected error occurred during payment verification. Please contact support."
      });
      return { success: false, verified: false };
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  return { verifyPayment, isVerifying, verificationResult };
};
