
import { useState, useCallback } from 'react';
import { verifyAndSyncPayment } from '@/utils/payment/services/paymentVerificationService';
import { savePaymentRecord } from '@/utils/payment/services/paymentRecordService';
import { sendBookingConfirmationEmail } from '@/utils/email/bookingEmails';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createBookingDetailsFromConsultation } from '@/utils/consultation/consultationRecovery';

/**
 * Hook for payment recovery operations
 */
export function usePaymentRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{success: boolean; message: string} | null>(null);
  const { toast } = useToast();

  /**
   * Recovers a payment and sends the confirmation email again
   */
  const recoverPaymentAndSendEmail = useCallback(
    async (referenceId: string, paymentId: string, amount: number, orderId: string = '') => {
      setIsRecovering(true);
      setRecoveryResult(null);

      try {
        toast({
          title: "Recovery in progress",
          description: "Attempting to recover payment details...",
        });

        console.log(`Starting payment recovery for ${referenceId} with payment ${paymentId}`);

        // Step 1: Check if consultation record exists
        const { data: consultationData, error: consultationError } = await supabase
          .from('consultations')
          .select('*')
          .eq('reference_id', referenceId)
          .maybeSingle();

        // Step 2: Verify payment with Razorpay
        const paymentVerified = await verifyAndSyncPayment(paymentId);
        console.log(`Payment verification result: ${paymentVerified}`);

        if (!paymentVerified) {
          toast({
            title: "Payment Not Verified",
            description: "Could not verify payment with Razorpay.",
            variant: "destructive",
          });
          setRecoveryResult({
            success: false,
            message: "Could not verify payment with Razorpay. Please contact support."
          });
          return false;
        }

        // Step 3: If consultation doesn't exist, create a placeholder record
        let finalConsultationData = consultationData;
        
        if (!consultationData && !consultationError) {
          console.log("No consultation record found, creating placeholder");
          
          // Create a minimal placeholder record
          const { data: placeholderData, error: placeholderError } = await supabase
            .from('consultations')
            .insert({
              reference_id: referenceId,
              payment_id: paymentId,
              order_id: orderId,
              amount: amount,
              payment_status: 'completed',
              status: 'payment_received_needs_details',
              consultation_type: 'recovery_needed',
              client_name: 'Payment Received - Recovery Needed',
              message: `Payment received but consultation details missing. Payment ID: ${paymentId}, Amount: ${amount}`,
              time_slot: 'to_be_scheduled' // Required field
            })
            .select()
            .single();
            
          if (placeholderError) {
            console.error("Error creating placeholder:", placeholderError);
            toast({
              title: "Recovery Failed",
              description: "Could not create consultation record.",
              variant: "destructive",
            });
            setRecoveryResult({
              success: false,
              message: "Could not create consultation record. Please contact support."
            });
            return false;
          }
          
          finalConsultationData = placeholderData;
          
        } else if (consultationError) {
          console.error("Error fetching consultation:", consultationError);
          toast({
            title: "Recovery Failed",
            description: "Could not fetch consultation details.",
            variant: "destructive",
          });
          setRecoveryResult({
            success: false,
            message: "Could not fetch consultation details. Please contact support."
          });
          return false;
        }

        // Step 4: If payment record doesn't exist, create it
        if (finalConsultationData && !finalConsultationData.payment_id) {
          console.log("Updating consultation with payment information");
          
          // Update the consultation with payment information
          await supabase
            .from('consultations')
            .update({
              payment_id: paymentId,
              order_id: orderId,
              amount: amount,
              payment_status: 'completed',
              status: finalConsultationData.status === 'payment_received_needs_details' 
                ? finalConsultationData.status 
                : 'confirmed'
            })
            .eq('reference_id', referenceId);
        }

        // Step 5: Send confirmation email with consultation details
        if (finalConsultationData) {
          const bookingDetails = createBookingDetailsFromConsultation(finalConsultationData);
          
          if (bookingDetails) {
            bookingDetails.highPriority = true;
            bookingDetails.isRecovery = true; // Now this property is defined in the type
            
            console.log("Sending recovery email with booking details:", bookingDetails);
            const emailResult = await sendBookingConfirmationEmail(bookingDetails);
            
            if (emailResult) {
              console.log("Recovery email sent successfully");
              
              // Update the consultation record to mark email as sent
              await supabase
                .from('consultations')
                .update({ email_sent: true })
                .eq('reference_id', referenceId);
              
              toast({
                title: "Recovery Completed",
                description: "Payment verified and confirmation email sent.",
              });
              
              setRecoveryResult({
                success: true,
                message: "Payment verified and confirmation email sent successfully."
              });
              
              return true;
            } else {
              console.error("Failed to send recovery email");
              toast({
                title: "Email Sending Failed",
                description: "Payment verified but couldn't send confirmation email.",
                variant: "destructive",
              });
              
              setRecoveryResult({
                success: false,
                message: "Payment verified but couldn't send confirmation email. Please try again later."
              });
            }
          } else {
            console.error("Could not create booking details from consultation");
            toast({
              title: "Recovery Partially Completed",
              description: "Payment verified but couldn't create email details.",
              variant: "destructive",
            });
            
            setRecoveryResult({
              success: false,
              message: "Payment verified but couldn't create email details. Please contact support."
            });
          }
        }

        return false;
      } catch (error) {
        console.error("Payment recovery error:", error);
        toast({
          title: "Recovery Failed",
          description: "An unexpected error occurred during recovery.",
          variant: "destructive",
        });
        
        setRecoveryResult({
          success: false,
          message: "An unexpected error occurred during recovery. Please contact support."
        });
        
        return false;
      } finally {
        setIsRecovering(false);
      }
    },
    [toast]
  );

  return { recoverPaymentAndSendEmail, isRecovering, recoveryResult };
}
