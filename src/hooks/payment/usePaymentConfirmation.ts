
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAndSyncPayment, savePaymentRecord } from "@/utils/payment/razorpayService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";
import { createRecoveryConsultation } from "@/utils/consultation/consultationRecovery";

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
          console.log("Starting payment verification process for payment ID:", paymentId);
          
          // Step 1: Verify the payment with Razorpay
          const verified = await verifyAndSyncPayment(paymentId);
          
          if (verified) {
            console.log("Payment verified successfully with Razorpay");
            
            // Store payment IDs in session storage for recovery purposes
            if (referenceId) {
              console.log("Storing payment IDs in session storage");
              sessionStorage.setItem(`payment_id_${referenceId}`, paymentId);
              if (orderId) sessionStorage.setItem(`order_id_${referenceId}`, orderId);
            }
            
            // Step 2: Save payment record if we have enough details
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
                  console.log("Payment record saved successfully");
                  setBookingRecovered(true);
                  
                  toast({
                    title: "Payment Record Saved",
                    description: "Your payment record has been successfully saved."
                  });
                } else {
                  console.error("Failed to save payment record for referenceId:", referenceId);
                  
                  // Try to create a recovery consultation if payment record couldn't be saved
                  const recoveryCreated = await createRecoveryConsultation(referenceId, paymentId, amount);
                  
                  if (recoveryCreated) {
                    console.log("Created recovery consultation for reference ID:", referenceId);
                    // Try again to save the payment with the recovery consultation
                    await savePaymentRecord({
                      paymentId,
                      orderId: orderId || '',
                      amount,
                      referenceId,
                      status: 'completed'
                    });
                  }
                }
              } catch (error) {
                console.error("Error saving payment record:", error);
              }
            } else {
              console.warn("Missing referenceId or amount, can't save payment record");
            }
            
            setVerificationResult({
              success: true,
              message: "Your payment has been verified and your booking is confirmed."
            });
          } else {
            console.error("Payment verification failed for payment ID:", paymentId);
            
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
      } else if (paymentFailed) {
        console.log("Payment was flagged as failed");
        
        setVerificationResult({
          success: false,
          message: "Your payment was not completed or was declined. Please try again or use a different payment method."
        });
        
        setIsVerifying(false);
      } else if (verificationFailed) {
        console.log("Payment verification was flagged as failed");
        
        setVerificationResult({
          success: false,
          message: "We could not verify your payment. Please contact support with your payment ID and reference number."
        });
        
        setIsVerifying(false);
      } else if (!paymentId) {
        console.log("No payment ID provided, skipping verification");
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [paymentId, orderId, referenceId, amount, verificationResult, toast, setBookingRecovered, paymentFailed, verificationFailed]);

  // Return both isVerifying state and setter
  return {
    isVerifying,
    setIsVerifying,
    verificationResult
  };
};
