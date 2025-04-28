
import { useState } from 'react';
import { verifyRazorpayPayment } from '@/utils/payment/razorpayService';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentStorageService';
import { updateConsultationStatus } from '@/utils/payment/services/serviceUtils';
import { sendEmailForConsultation } from '@/utils/payment/services/emailNotificationService';

interface UsePaymentVerificationProps {
  handleConfirmBooking?: () => Promise<void>;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
}

export const usePaymentVerification = ({
  handleConfirmBooking,
  setIsProcessing,
  setPaymentCompleted,
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const verifyPayment = async (response: any, amount: number, bookingDetails: any, referenceId: string) => {
    try {
      setIsVerifying(true);
      
      if (handleConfirmBooking) {
        console.log("Creating consultation record...");
        await handleConfirmBooking();
      }
      
      const verificationPromise = new Promise<boolean>(async (resolve) => {
        await new Promise(r => setTimeout(r, 5000));
        
        const isVerified = await verifyRazorpayPayment({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
        
        resolve(isVerified);
      });
      
      const isVerified = await verificationPromise;
      console.log("Payment verification result:", isVerified);
      
      if (isVerified) {
        // Store payment ID in session for potential recovery
        storePaymentDetailsInSession(
          referenceId, 
          response.razorpay_payment_id, 
          amount, 
          response.razorpay_order_id,
          bookingDetails
        );
        
        // Update consultation status directly
        const statusUpdated = await updateConsultationStatus(referenceId, 'paid');
        console.log(`Consultation status updated: ${statusUpdated}`);
        
        // Send email notification directly
        const emailSent = await sendEmailForConsultation(null, {
          ...bookingDetails,
          referenceId
        });
        
        console.log(`Email notification sent: ${emailSent}`);

        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }

        return { success: true, statusUpdated };
      }
      
      return { success: false, statusUpdated: false };
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  return { verifyPayment, isVerifying };
};
