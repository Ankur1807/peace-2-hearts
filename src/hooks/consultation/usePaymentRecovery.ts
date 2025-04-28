
import { useState } from 'react';
import { recoverPaymentRecord } from '@/utils/payment/services/paymentRecoveryService';
import { useToast } from '@/hooks/use-toast';

interface RecoveryResult {
  success: boolean;
  message: string;
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
      
      const recovered = await recoverPaymentRecord(referenceId, paymentId, amount, orderId);
      
      if (recovered) {
        setRecoveryResult({
          success: true,
          message: "Your payment has been successfully processed and a confirmation email has been sent."
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
