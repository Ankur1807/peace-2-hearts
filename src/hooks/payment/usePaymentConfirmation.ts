
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAndSyncPayment, savePaymentRecord } from "@/utils/payment/razorpayService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { usePaymentRecovery } from "@/hooks/consultation/usePaymentRecovery";

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
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId && !verificationResult) {
        setIsVerifying(true);
        try {
          const verified = await verifyAndSyncPayment(paymentId);
          
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
                  setBookingRecovered(true);
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
      }
    };
    
    verifyPayment();
  }, [paymentId, orderId, referenceId, amount, verificationResult, toast, setBookingRecovered]);

  // Return both isVerifying state and setter
  return {
    isVerifying,
    setIsVerifying,
    verificationResult
  };
};
