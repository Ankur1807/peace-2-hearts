
import { useState } from 'react';
import { savePaymentRecord } from '@/utils/payment/razorpayService';
import { verifyAndSyncPayment } from '@/utils/payment/razorpayService';

export const usePaymentRecovery = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{ success: boolean; message: string } | null>(null);

  const recoverPaymentAndSendEmail = async (referenceId: string, paymentId: string, amount: number, orderId?: string) => {
    try {
      setIsRecovering(true);
      
      // Verify payment with Razorpay to ensure it's valid
      const paymentVerified = await verifyAndSyncPayment(paymentId);
      
      if (!paymentVerified) {
        setRecoveryResult({
          success: false,
          message: "This payment could not be verified with Razorpay. Please contact support."
        });
        return false;
      }
      
      // Save payment record and trigger email
      const result = await savePaymentRecord({
        paymentId,
        orderId: orderId || '',
        amount,
        referenceId,
        status: 'paid'
      });
      
      if (result) {
        setRecoveryResult({
          success: true,
          message: "Your payment has been successfully recovered and confirmation email sent."
        });
        return true;
      } else {
        setRecoveryResult({
          success: false,
          message: "We recovered your payment but couldn't send a confirmation email."
        });
        return false;
      }
    } catch (error) {
      console.error("Error in payment recovery:", error);
      setRecoveryResult({
        success: false,
        message: "An error occurred during recovery. Please contact support."
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
