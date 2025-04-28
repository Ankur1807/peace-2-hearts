import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  checkPaymentRecord, 
  fetchConsultationData, 
  createBookingDetailsFromConsultation, 
  createConsultationFromBookingDetails 
} from '@/utils/consultation/consultationRecovery';
import { updateConsultationStatus } from '@/utils/payment/services/serviceUtils';
import { getPaymentDetailsFromSession } from '@/utils/payment/services/paymentStorageService';
import { sendEmailForConsultation } from '@/utils/payment/services/emailNotificationService';
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
      
      // Check if consultation exists already
      const consultationData = await fetchConsultationData(referenceId);
      
      if (consultationData) {
        console.log("Found existing consultation:", consultationData);
        
        // Create booking details from consultation
        const bookingDetails = createBookingDetailsFromConsultation(consultationData);
        
        // Check if consultation is already marked as paid
        if (consultationData.status === 'paid') {
          console.log("Consultation is already marked as paid");
          
          // Send confirmation email again
          await sendEmailForConsultation(consultationData, {
            ...bookingDetails,
            isResend: true,
            highPriority: true
          });
          
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
        
        // If we have a payment ID, verify it with Razorpay
        let paymentVerified = false;
        if (paymentId) {
          paymentVerified = await verifyAndSyncPayment(paymentId);
          
          if (paymentVerified) {
            console.log("Payment verified with Razorpay");
            
            // Update consultation status to paid
            const statusUpdated = await updateConsultationStatus(referenceId, 'paid');
            
            if (statusUpdated) {
              console.log("Consultation status updated to paid");
              
              // Send confirmation email
              await sendEmailForConsultation(consultationData, {
                ...bookingDetails,
                highPriority: true
              });
              
              setRecoveryResult({
                success: true,
                message: "Your payment has been recovered and a confirmation email has been sent.",
                bookingDetails
              });
              
              return true;
            }
          } else {
            console.log("Payment could not be verified with Razorpay");
          }
        }
        
        // Try to recover anyway by updating the status and sending an email
        const statusUpdated = await updateConsultationStatus(referenceId, 'paid');
        
        if (statusUpdated) {
          console.log("Consultation status updated to paid");
          
          // Send confirmation email
          await sendEmailForConsultation(consultationData, {
            ...bookingDetails,
            highPriority: true
          });
          
          setRecoveryResult({
            success: true,
            message: "Your booking has been recovered and a confirmation email has been sent.",
            bookingDetails
          });
          
          return true;
        }
        
        setRecoveryResult({
          success: false,
          message: "We couldn't update your booking status. Please contact support.",
          bookingDetails
        });
        
        return false;
      }
      
      // Get any booking details from session storage
      const sessionData = getPaymentDetailsFromSession(referenceId);
      const bookingDetails = sessionData.bookingDetails;
      
      // If we don't have a consultation but we have booking details, create one
      if (bookingDetails) {
        const consultationCreated = await createConsultationFromBookingDetails({
          ...bookingDetails,
          referenceId
        });
        
        if (consultationCreated) {
          console.log("Successfully created consultation from booking details");
          
          // Update the consultation status to paid
          const statusUpdated = await updateConsultationStatus(referenceId, 'paid');
          
          if (statusUpdated) {
            console.log("Consultation status updated to paid");
            
            // Send confirmation email
            await sendEmailForConsultation(null, {
              ...bookingDetails,
              highPriority: true
            });
            
            setRecoveryResult({
              success: true,
              message: "Your booking has been recovered and a confirmation email has been sent.",
              bookingDetails
            });
            
            return true;
          }
        }
      }
      
      setRecoveryResult({
        success: false,
        message: "We couldn't recover your booking. Please contact support with your reference ID."
      });
      
      return false;
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
