
import { useState } from 'react';
import { recoverPaymentRecord } from '@/utils/payment/services/paymentRecoveryService';
import { useToast } from '@/hooks/use-toast';
import { checkPaymentRecord, fetchConsultationData, createBookingDetailsFromConsultation } from '@/utils/consultation/consultationRecovery';
import { createRazorpayOrder, verifyAndSyncPayment } from '@/utils/payment/razorpayService';

interface RecoveryResult {
  success: boolean;
  message: string;
  bookingDetails?: any;
}

export const usePaymentRecovery = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult | null>(null);
  const { toast } = useToast();
  
  const recoverPaymentAndSendEmail = async (
    referenceId: string,
    paymentId: string,
    amount: number,
    orderId?: string
  ) => {
    if (!referenceId || !paymentId || amount <= 0) {
      setRecoveryResult({
        success: false,
        message: "Missing required information for payment recovery"
      });
      return false;
    }
    
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      console.log("Attempting to recover payment and send confirmation email", {
        referenceId,
        paymentId,
        amount,
        orderId: orderId || 'N/A'
      });
      
      // Step 1: Check if payment record already exists
      const paymentExists = await checkPaymentRecord(referenceId);
      
      if (paymentExists) {
        console.log("Payment record already exists for this reference ID");
        
        // Try to fetch booking details for the existing payment
        const consultationData = await fetchConsultationData(referenceId);
        const bookingDetails = createBookingDetailsFromConsultation(consultationData);
        
        setRecoveryResult({
          success: true,
          message: "Your payment record already exists in our system. A confirmation email has been sent again.",
          bookingDetails
        });
        
        toast({
          title: "Payment Already Recorded",
          description: "Your payment was already recorded in our system.",
        });
        
        return true;
      }
      
      // Step 2: Verify the payment exists and is valid with Razorpay
      const paymentVerified = await verifyAndSyncPayment(paymentId);
      
      if (!paymentVerified) {
        console.error(`Payment ${paymentId} couldn't be verified with Razorpay`);
        
        setRecoveryResult({
          success: false,
          message: "We couldn't verify your payment with our payment provider. Please contact support with your payment details."
        });
        
        toast({
          title: "Verification Failed",
          description: "We couldn't verify your payment with our payment provider.",
          variant: "destructive"
        });
        
        return false;
      }
      
      console.log(`Payment ${paymentId} verified with Razorpay`);
      
      // Step 3: Attempt to recover the payment record
      const recovered = await recoverPaymentRecord(referenceId, paymentId, amount, orderId);
      
      if (recovered) {
        // Try to fetch the booking details after recovery
        const consultationData = await fetchConsultationData(referenceId);
        const bookingDetails = createBookingDetailsFromConsultation(consultationData);
        
        setRecoveryResult({
          success: true,
          message: "Your payment has been successfully processed and a confirmation email has been sent.",
          bookingDetails
        });
        
        toast({
          title: "Recovery Successful",
          description: "Your booking has been confirmed and a confirmation email has been sent.",
        });
        
        return true;
      } else {
        setRecoveryResult({
          success: false,
          message: "We couldn't verify your payment or send a confirmation. Please contact support with your payment details."
        });
        
        toast({
          title: "Recovery Failed",
          description: "We couldn't process your payment details. Please contact our support team.",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error("Error in payment recovery process:", error);
      
      setRecoveryResult({
        success: false,
        message: "An error occurred during the recovery process. Please contact support."
      });
      
      toast({
        title: "Recovery Error",
        description: "An unexpected error occurred. Please try again later or contact support.",
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
};
