
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyAndSyncPayment } from "@/utils/payment/razorpayService";
import { storePaymentDetailsInSession } from "@/utils/payment/services/paymentStorageService";
import { updateConsultationStatus } from "@/utils/payment/services/serviceUtils";
import { sendEmailForConsultation } from "@/utils/payment/services/emailNotificationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingDetails } from "@/utils/types";

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
              storePaymentDetailsInSession({
                referenceId,
                paymentId,
                orderId,
                amount
              });
            }
            
            // Step 2: Save payment record if we have enough details
            if (referenceId && amount > 0) {
              try {
                console.log("Attempting to update consultation status with reference ID:", referenceId);
                
                // Update consultation with payment status
                const statusUpdated = await updateConsultationStatus(
                  referenceId,
                  'paid',
                  paymentId,
                  amount,
                  orderId || undefined
                );
                
                if (statusUpdated) {
                  console.log("Consultation status updated successfully");
                  setBookingRecovered(true);
                  
                  // Get consultation data for email
                  const { data: consultation } = await supabase
                    .from('consultations')
                    .select('*')
                    .eq('reference_id', referenceId)
                    .single();
                  
                  if (consultation) {
                    // Create booking details for email
                    const bookingDetails: BookingDetails = {
                      referenceId,
                      clientName: consultation.client_name,
                      email: consultation.client_email,
                      consultationType: consultation.consultation_type,
                      services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
                      serviceCategory: consultation.consultation_type?.toLowerCase().includes('legal') ? 
                        'legal' : consultation.consultation_type?.toLowerCase().includes('holistic') ? 
                        'holistic' : 'mental-health',
                      highPriority: true
                    };
                    
                    // Send email notification
                    await sendEmailForConsultation(bookingDetails);
                  }
                  
                  toast({
                    title: "Payment Record Saved",
                    description: "Your payment record has been successfully saved."
                  });
                } else {
                  console.error("Failed to save payment record for referenceId:", referenceId);
                  
                  // Try to create a recovery consultation if payment record couldn't be saved
                  // Note: We're handling this directly instead of depending on createRecoveryConsultation
                  const { data: recoveryData, error: recoveryError } = await supabase
                    .from('consultations')
                    .insert({
                      reference_id: referenceId,
                      status: 'payment_received_needs_details',
                      payment_status: 'completed',
                      payment_id: paymentId,
                      amount: amount,
                      consultation_type: 'recovery_needed',
                      client_name: 'Payment Received - Recovery Needed',
                      message: `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`,
                      time_slot: 'to_be_scheduled',
                      source: 'recovery' // Add source for tracking
                    })
                    .select();
                    
                  if (!recoveryError && recoveryData) {
                    console.log("Created recovery consultation record:", recoveryData);
                  } else if (recoveryError) {
                    console.error("Error creating recovery record:", recoveryError);
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
