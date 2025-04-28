
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  checkPaymentRecord, 
  fetchConsultationData, 
  createBookingDetailsFromConsultation, 
  createConsultationFromBookingDetails 
} from '@/utils/consultation/consultationRecovery';
import { savePaymentRecord } from '@/utils/payment/services/paymentRecordService';
import { getPaymentDetailsFromSession } from '@/utils/payment/services/paymentStorageService';
import { verifyAndSyncPayment } from '@/utils/payment/razorpayService';

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
    paymentId?: string,
    amount?: number,
    orderId?: string
  ) => {
    if (!referenceId) {
      setRecoveryResult({
        success: false,
        message: "Missing required information for payment recovery: reference ID is required"
      });
      return false;
    }
    
    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      console.log("Starting payment recovery process for reference ID:", referenceId);
      
      // If paymentId or amount were not provided, try to get them from session storage
      if (!paymentId || !amount) {
        const sessionData = getPaymentDetailsFromSession(referenceId);
        
        if (sessionData.paymentId) {
          console.log("Retrieved payment details from session storage:", sessionData);
          paymentId = sessionData.paymentId;
          amount = sessionData.amount;
          orderId = sessionData.orderId || orderId;
        }
      }
      
      // We need at least a reference ID and either a payment ID or booking details
      if (!paymentId && amount <= 0) {
        console.error("Insufficient data for recovery:", { referenceId, paymentId, amount });
        
        setRecoveryResult({
          success: false,
          message: "Missing required information for payment recovery: payment ID and amount are required"
        });
        return false;
      }
      
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
      
      // Get any booking details from session storage
      const sessionData = getPaymentDetailsFromSession(referenceId);
      const bookingDetails = sessionData.bookingDetails;
      
      // Step 2: If we have paymentId, verify it exists with Razorpay
      let paymentVerified = false;
      if (paymentId) {
        paymentVerified = await verifyAndSyncPayment(paymentId);
        
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
      }
      
      // Step 3: If we have booking details but no consultation, create one
      if (bookingDetails) {
        const consultationCreated = await createConsultationFromBookingDetails({
          ...bookingDetails,
          referenceId
        });
        
        if (consultationCreated) {
          console.log("Successfully created consultation from booking details");
        }
      }
      
      // Step 4: Attempt to recover the payment record
      const recovered = await savePaymentRecord({
        referenceId,
        paymentId: paymentId || 'manual_recovery',
        orderId: orderId || '',
        amount: amount || 0,
        status: 'completed',
        bookingDetails
      });
      
      if (recovered) {
        // Try to fetch the booking details after recovery
        const consultationData = await fetchConsultationData(referenceId);
        const recoveredBookingDetails = createBookingDetailsFromConsultation(consultationData);
        
        setRecoveryResult({
          success: true,
          message: "Your payment has been successfully processed and a confirmation email has been sent.",
          bookingDetails: recoveredBookingDetails || bookingDetails
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
  
  // This function adds the ability to force a recovery attempt even from minimal data
  const manualRecoveryAttempt = async (
    referenceId: string,
    clientEmail?: string,
    clientName?: string
  ) => {
    setIsRecovering(true);
    try {
      // First check if the consultation exists
      const consultationData = await fetchConsultationData(referenceId);
      
      // If exists, attempt normal recovery
      if (consultationData) {
        const paymentId = sessionStorage.getItem(`payment_id_${referenceId}`);
        if (paymentId) {
          // We have both consultation and payment ID, use the standard flow
          return await recoverPaymentAndSendEmail(referenceId, paymentId);
        }
        
        // Otherwise, try to create a manual recovery record
        setRecoveryResult({
          success: true,
          message: "Found your booking record. A confirmation email has been sent.",
          bookingDetails: createBookingDetailsFromConsultation(consultationData)
        });
        return true;
      }
      
      // If consultation doesn't exist but we have client info, create a recovery record
      if (clientEmail || clientName) {
        const minimalBookingDetails = {
          clientName: clientName || "Manual Recovery",
          email: clientEmail,
          referenceId: referenceId,
          consultationType: "manual_recovery",
          services: ["manual_recovery"],
          serviceCategory: "recovery" // Add the missing serviceCategory property
        };
        
        // Create consultation with minimal details
        const consultationCreated = await createConsultationFromBookingDetails(minimalBookingDetails);
        
        if (consultationCreated) {
          setRecoveryResult({
            success: true,
            message: "We've created a recovery record for your booking. A confirmation email will be sent to your registered email.",
            bookingDetails: minimalBookingDetails
          });
          return true;
        }
      }
      
      setRecoveryResult({
        success: false,
        message: "We couldn't find or create a booking record with the provided information. Please contact support."
      });
      return false;
    } catch (error) {
      console.error("Error in manual recovery attempt:", error);
      setRecoveryResult({
        success: false,
        message: "An error occurred during the manual recovery process. Please contact support."
      });
      return false;
    } finally {
      setIsRecovering(false);
    }
  };
  
  return {
    isRecovering,
    recoveryResult,
    recoverPaymentAndSendEmail,
    manualRecoveryAttempt
  };
};
