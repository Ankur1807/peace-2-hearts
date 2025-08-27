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
      
      // Use direct fetch for GET request with query parameters
      const supabaseUrl = 'https://mcbdxszoozmlelejvizn.supabase.co';
      const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYmR4c3pvb3ptbGVsZWp2aXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4NzM3NjUsImV4cCI6MjA1NzQ0OTc2NX0.e4Nw3vrz2qewoZMKJvsYExgnyFCkHMLdV9ecty5xlf0';
      const url = `${supabaseUrl}/functions/v1/payment-status?order_id=${encodeURIComponent(orderIdToCheck)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
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
        
        // Jittered backoff: start 1.5s, cap at 6s
        const baseDelay = Math.min(1500 + (retryCount * 300), 6000);
        const jitter = Math.random() * 500; // Add 0-500ms jitter
        const delay = baseDelay + jitter;
        
        setTimeout(pollStatus, delay);
      } else {
        console.log("Max polling retries reached - showing gentle processing message");
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