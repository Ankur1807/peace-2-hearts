import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentStatusResult {
  success: boolean;
  status?: string;
  reason?: string;
  error?: string;
}

interface UsePaymentStatusProps {
  orderId: string | null;
  pollInterval?: number;
  maxRetries?: number;
}

export const usePaymentStatus = ({
  orderId,
  pollInterval = 2000,
  maxRetries = 60 // 2 minutes of polling
}: UsePaymentStatusProps) => {
  const [statusResult, setStatusResult] = useState<PaymentStatusResult | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const checkPaymentStatus = async (orderIdToCheck: string): Promise<PaymentStatusResult> => {
    try {
      console.log(`Checking payment status for order: ${orderIdToCheck}`);
      
      const { data, error } = await supabase.functions.invoke('payment-status', {
        body: {
          order_id: orderIdToCheck
        }
      });
      
      if (error) {
        console.error("Error checking payment status:", error);
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      console.log("Payment status result:", data);
      
      return {
        success: data.success || false,
        status: data.status,
        reason: data.reason
      };
    } catch (err) {
      console.error("Error in checkPaymentStatus:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err)
      };
    }
  };

  const startPolling = () => {
    if (!orderId || isPolling) return;
    
    setIsPolling(true);
    setRetryCount(0);
    
    console.log(`Starting payment status polling for order: ${orderId}`);
    
    const pollStatus = async () => {
      const result = await checkPaymentStatus(orderId);
      setStatusResult(result);
      
      // Stop polling if payment is captured or failed
      if (result.success && result.status === 'captured') {
        console.log("Payment captured, stopping polling");
        setIsPolling(false);
        return;
      }
      
      if (result.success && result.status === 'failed') {
        console.log("Payment failed, stopping polling");
        setIsPolling(false);
        return;
      }
      
      // Continue polling if not at max retries
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(pollStatus, pollInterval);
      } else {
        console.log("Max polling retries reached, stopping");
        setIsPolling(false);
      }
    };
    
    pollStatus();
  };

  const checkStatusOnce = async () => {
    if (!orderId) return null;
    
    const result = await checkPaymentStatus(orderId);
    setStatusResult(result);
    return result;
  };

  // Auto-check once when orderId is available
  useEffect(() => {
    if (orderId && !statusResult) {
      checkStatusOnce();
    }
  }, [orderId]);

  return {
    statusResult,
    isPolling,
    retryCount,
    startPolling,
    checkStatusOnce
  };
};