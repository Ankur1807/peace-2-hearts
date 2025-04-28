
import { useState } from 'react';
import { verifyRazorpayPayment } from '@/utils/payment/razorpayService';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentRecordService';
import { usePaymentRecord } from './usePaymentRecord';

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
  const { createPaymentRecord } = usePaymentRecord();

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
        const paymentSaved = await createPaymentRecord({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          amount,
          referenceId,
          bookingDetails
        });

        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }

        return { success: true, paymentSaved };
      }
      
      return { success: false, paymentSaved: false };
    } finally {
      setIsVerifying(false);
      setIsProcessing(false);
    }
  };

  return { verifyPayment, isVerifying };
};
