import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storePaymentDetailsInSession } from "@/utils/payment/services/paymentStorageService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UsePaymentConfirmationProps {
  referenceId: string | null;
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  paymentFailed: boolean;
  verificationFailed: boolean;
  setBookingRecovered: (recovered: boolean) => void;
}

export const usePaymentConfirmation = ({
  referenceId,
  paymentId,
  orderId,
  amount,
  paymentFailed,
  verificationFailed,
  setBookingRecovered,
}: UsePaymentConfirmationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId && !verificationResult) {
        setIsVerifying(true);

        try {
          console.log("🚀 Calling Supabase Edge Function: verify-payment");

          const { data: res, error } = await supabase.functions.invoke("verify-payment", {
            body: {
              paymentId,
              orderId,
              bookingDetails: {
                referenceId,
                amount,
              },
            },
          });

          if (error) {
            console.error("❌ Supabase function error:", error);
            setVerificationResult({
              success: false,
              message: "Verification failed. Contact support.",
            });
            return;
          }

          console.log("✅ verify-payment response:", res);

          if (res?.success) {
            if (referenceId) {
              storePaymentDetailsInSession({
                referenceId,
                paymentId,
                orderId,
                amount,
              });
            }

            setVerificationResult({
              success: true,
              message: "Your payment has been verified and your booking is confirmed.",
            });

            toast({
              title: "Payment Successful",
              description: "Your booking has been saved.",
            });

            setBookingRecovered(true);
            navigate(res.redirectUrl || "/thank-you");
          } else {
            setVerificationResult({
              success: false,
              message: res?.error || "We could not verify your payment. Please contact support.",
            });

            toast({
              title: "Verification Failed",
              description: res?.error || "Unable to confirm payment. Contact support.",
            });
          }
        } catch (err) {
          console.error("Unhandled verification error:", err);
          setVerificationResult({
            success: false,
            message: "Something went wrong. Contact support with your payment ID.",
          });
        } finally {
          setIsVerifying(false);
        }
      } else if (paymentFailed) {
        setVerificationResult({
          success: false,
          message: "Your payment failed. Please try again.",
        });
        setIsVerifying(false);
      } else if (verificationFailed) {
        setVerificationResult({
          success: false,
          message: "We could not verify your payment. Please contact support.",
        });
        setIsVerifying(false);
      } else if (!paymentId) {
        console.log("No payment ID provided.");
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentId, orderId, referenceId, amount, verificationResult]);

  return {
    isVerifying,
    setIsVerifying,
    verificationResult,
  };
};
