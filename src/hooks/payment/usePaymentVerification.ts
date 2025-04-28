
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyRazorpayPayment, verifyAndSyncPayment, savePaymentRecord } from "@/utils/payment/razorpayService";
import { useToast } from "@/hooks/use-toast";

interface UsePaymentVerificationProps {
  paymentId: string | null;
  orderId: string | null;
  signature: string | null;
  amount: number;
  referenceId: string | null;
}

export const usePaymentVerification = ({
  paymentId,
  orderId,
  signature,
  amount,
  referenceId
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyPayment = async () => {
    if (paymentId) {
      setIsVerifying(true);
      try {
        // First try standard verification
        let verified = false;
        if (orderId && signature) {
          verified = await verifyRazorpayPayment({
            paymentId,
            orderId,
            signature
          });
        }

        // If standard verification fails, try direct verification
        if (!verified) {
          verified = await verifyAndSyncPayment(paymentId);
        }

        if (verified) {
          if (referenceId && amount > 0) {
            try {
              console.log("Attempting to save payment record with reference ID:", referenceId);
              const paymentSaved = await savePaymentRecord({
                paymentId,
                orderId: orderId || '',
                amount,
                referenceId,
                status: 'completed'
              });

              if (paymentSaved) {
                toast({
                  title: "Payment Record Saved",
                  description: "Your payment record has been successfully saved."
                });
              } else {
                console.error("Failed to save payment record for referenceId:", referenceId);
              }
            } catch (error) {
              console.error("Error saving payment record:", error);
            }
          }

          setVerificationResult({
            success: true,
            message: "Your payment has been verified and your booking is confirmed."
          });
        } else {
          setVerificationResult({
            success: false,
            message: "We could not verify your payment. Please contact support with your payment ID."
          });
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationResult({
          success: false,
          message: "An error occurred while verifying your payment. Please contact support."
        });
      } finally {
        setIsVerifying(false);
      }
    } else {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [paymentId, orderId, signature]);

  return {
    isVerifying,
    verificationResult
  };
};
