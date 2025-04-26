
import { useState, useCallback } from 'react';
import { recoverPaymentRecord } from '@/utils/payment/razorpayService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to handle payment recovery operations
 */
export const usePaymentRecovery = () => {
  const { toast } = useToast();
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<{success: boolean, message: string} | null>(null);

  /**
   * Attempt to recover a payment record and send confirmation email
   */
  const recoverPaymentAndSendEmail = useCallback(async (
    referenceId: string,
    paymentId: string,
    amount: number,
    orderId?: string
  ) => {
    if (!referenceId || !paymentId) {
      setRecoveryResult({
        success: false,
        message: "Missing required information for recovery"
      });
      return false;
    }

    setIsRecovering(true);
    setRecoveryResult(null);
    
    try {
      console.log(`Starting recovery process for payment ${paymentId}, consultation ${referenceId}`);
      
      const recovered = await recoverPaymentRecord(
        referenceId,
        paymentId,
        amount,
        orderId
      );
      
      if (recovered) {
        setRecoveryResult({
          success: true,
          message: "Payment record recovered successfully and confirmation email sent"
        });
        
        toast({
          title: "Recovery Successful",
          description: "Payment record has been recovered and confirmation email sent",
        });
        
        return true;
      } else {
        setRecoveryResult({
          success: false,
          message: "Failed to recover payment record"
        });
        
        toast({
          title: "Recovery Failed",
          description: "Could not recover payment record. Please contact support.",
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
        title: "Recovery Error",
        description: "An error occurred during payment recovery. Please try again.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [toast]);

  return {
    isRecovering,
    recoveryResult,
    recoverPaymentAndSendEmail
  };
};
