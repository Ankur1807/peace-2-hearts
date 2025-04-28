
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyRazorpayPayment, verifyAndSyncPayment, savePaymentRecord } from "@/utils/payment/razorpayService";
import { storePaymentDetailsInSession } from "@/utils/payment/services/paymentStorageService";
import { updateConsultationStatus } from "@/utils/payment/services/serviceUtils";
import { sendEmailForConsultation } from "@/utils/payment/services/emailNotificationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

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
              // Store payment details in session for recovery
              storePaymentDetailsInSession({
                referenceId,
                paymentId,
                amount,
                orderId: orderId || ''
              });
              
              // Update consultation with payment info
              const success = await savePaymentRecord({
                paymentId,
                orderId: orderId || '',
                amount,
                referenceId,
                status: 'paid'
              });

              if (success) {
                toast({
                  title: "Booking Confirmed",
                  description: "Your payment has been processed and booking confirmed."
                });
              }
            } catch (error) {
              console.error("Error processing payment confirmation:", error);
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
