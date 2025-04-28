
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAndRecordPayment } from "@/utils/payment/services/paymentVerificationService";
import { useToast } from "@/hooks/use-toast";
import { BookingDetails } from "@/utils/types";

interface UsePaymentVerificationProps {
  paymentId: string | null;
  orderId: string | null;
  signature: string | null;
  amount: number;
  referenceId: string | null;
  bookingDetails?: BookingDetails;
}

export const usePaymentVerification = ({
  paymentId,
  orderId,
  signature,
  amount,
  referenceId,
  bookingDetails
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY = 3;

  const verifyPayment = async () => {
    if (!paymentId || !referenceId) {
      setIsVerifying(false);
      setVerificationResult({
        success: false,
        message: "Missing payment details. Please check your payment status or contact support."
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log(`Verifying payment ${paymentId} for reference ${referenceId} (attempt ${retryCount + 1}/${MAX_RETRY})`);
      
      const verified = await verifyAndRecordPayment(
        paymentId,
        orderId,
        amount,
        referenceId,
        bookingDetails
      );

      if (verified) {
        console.log("Payment verified successfully");
        
        setVerificationResult({
          success: true,
          message: "Your payment has been verified and your booking is confirmed."
        });
        
        toast({
          title: "Booking Confirmed",
          description: "Your payment has been processed and booking confirmed."
        });
      } else {
        console.error("Payment verification failed");
        
        // If we haven't reached max retries, schedule another attempt
        if (retryCount < MAX_RETRY - 1) {
          console.log(`Scheduling retry attempt ${retryCount + 2}/${MAX_RETRY}`);
          setRetryCount(prev => prev + 1);
          return; // Don't update verification result yet
        }
        
        setVerificationResult({
          success: false,
          message: "We could not verify your payment. Please contact support with your payment ID."
        });
        
        toast({
          title: "Verification Issue",
          description: "We're having trouble confirming your payment. Please contact support with your reference number.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      
      // If we haven't reached max retries, schedule another attempt
      if (retryCount < MAX_RETRY - 1) {
        console.log(`Scheduling retry attempt ${retryCount + 2}/${MAX_RETRY} after error`);
        setRetryCount(prev => prev + 1);
        return; // Don't update verification result yet
      }
      
      setVerificationResult({
        success: false,
        message: "An error occurred while verifying your payment. Please contact support."
      });
    } finally {
      if (retryCount >= MAX_RETRY - 1 || verificationResult?.success) {
        setIsVerifying(false);
      }
    }
  };

  // Effect for initial verification and retries
  useEffect(() => {
    verifyPayment();
  }, [paymentId, orderId, signature, retryCount]);

  // Set up retry with delay
  useEffect(() => {
    if (retryCount > 0 && retryCount < MAX_RETRY && !verificationResult?.success) {
      const retryDelay = 2000 * retryCount; // Increasing delay for each retry
      const retryTimer = setTimeout(() => {
        verifyPayment();
      }, retryDelay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [retryCount]);

  return {
    isVerifying,
    verificationResult
  };
};
