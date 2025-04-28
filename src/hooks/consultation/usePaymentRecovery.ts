
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyAndRecordPayment } from "@/utils/payment/services/paymentVerificationService";
import { checkConsultationStatus, fetchConsultationByReferenceId } from "@/utils/consultation/consultationRecovery";

export function usePaymentRecovery() {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{success: boolean, message: string} | null>(null);
  const { toast } = useToast();

  /**
   * Recover payment details and send email
   */
  const recoverPaymentAndSendEmail = async (
    referenceId: string, 
    paymentId: string, 
    amount: number, 
    orderId?: string | null
  ) => {
    if (!referenceId || !paymentId) {
      toast({
        title: "Recovery Failed",
        description: "Missing required information for recovery",
        variant: "destructive"
      });
      return false;
    }
    
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      console.log(`Starting payment recovery for ${referenceId} with payment ${paymentId}`);
      
      // Step 1: Check the current status in the database
      const consultation = await fetchConsultationByReferenceId(referenceId);
      
      if (!consultation) {
        console.error("No consultation found with reference ID:", referenceId);
        
        setRecoveryResult({
          success: false,
          message: "Could not find booking details for the provided reference ID"
        });
        
        toast({
          title: "Recovery Failed", 
          description: "Could not find booking details", 
          variant: "destructive"
        });
        
        return false;
      }
      
      // Check if payment is already marked as completed
      if (consultation.payment_status === 'completed' && consultation.payment_id === paymentId) {
        console.log("Payment already marked as completed");
        
        // If email wasn't sent, we'll still try to send it
        if (!consultation.email_sent) {
          console.log("Email not sent yet, will attempt to send");
        } else {
          console.log("Email already sent");
          
          setRecoveryResult({
            success: true,
            message: "Payment was already processed and email sent"
          });
          
          toast({ 
            title: "Already Processed", 
            description: "This payment was already processed successfully" 
          });
          
          return true;
        }
      }
      
      // Convert date from string if exists
      let bookingDetails = null;
      if (consultation) {
        // Create booking details from consultation
        bookingDetails = {
          clientName: consultation.client_name,
          email: consultation.client_email,
          phone: consultation.client_phone,
          referenceId,
          consultationType: consultation.consultation_type || 'general',
          services: consultation.consultation_type ? consultation.consultation_type.split(',') : [],
          date: consultation.date ? new Date(consultation.date) : undefined,
          timeSlot: consultation.time_slot,
          timeframe: consultation.timeframe,
          serviceCategory: consultation.consultation_type?.toLowerCase().includes('legal') ? 
            'legal' : consultation.consultation_type?.toLowerCase().includes('holistic') ? 
            'holistic' : 'mental-health',
          message: consultation.message,
          amount: amount
        };
      }
      
      // Step 2: Verify and record the payment again to ensure payment details are saved
      const result = await verifyAndRecordPayment(
        paymentId,
        orderId || null,
        amount,
        referenceId,
        bookingDetails
      );
      
      if (result) {
        setRecoveryResult({
          success: true,
          message: "Payment details recovered successfully"
        });
        
        toast({ 
          title: "Recovery Successful", 
          description: "Payment details were recovered successfully" 
        });
        
        return true;
      } else {
        setRecoveryResult({
          success: false,
          message: "Could not verify payment with Razorpay"
        });
        
        toast({ 
          title: "Recovery Failed", 
          description: "Payment verification failed with Razorpay", 
          variant: "destructive" 
        });
        
        return false;
      }
    } catch (error) {
      console.error("Error in payment recovery:", error);
      
      setRecoveryResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error during recovery"
      });
      
      toast({ 
        title: "Recovery Failed", 
        description: "An unexpected error occurred during recovery", 
        variant: "destructive" 
      });
      
      return false;
    } finally {
      setIsRecovering(false);
    }
  };

  return {
    isRecovering,
    recoveryResult,
    recoverPaymentAndSendEmail
  };
}
