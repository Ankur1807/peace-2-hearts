
import { useState, useEffect } from 'react';
import { usePaymentStatus } from './usePaymentStatus';
import { BookingDetails } from '@/utils/types';

interface UsePaymentVerificationProps {
  handleConfirmBooking?: () => Promise<void>;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  referenceId?: string;
  amount?: number;
  bookingDetails?: BookingDetails;
}

export const usePaymentVerification = ({
  setIsProcessing,
  setPaymentCompleted,
  paymentId,
  orderId,
  signature,
  referenceId,
  amount,
  bookingDetails
}: UsePaymentVerificationProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ 
    success: boolean; 
    verified: boolean;
    error?: string;
  } | null>(null);

  const { statusResult, isPolling, startPolling } = usePaymentStatus({
    orderId: orderId || null
  });

  // Monitor payment status changes
  useEffect(() => {
    if (statusResult) {
      const isVerified = statusResult.success && statusResult.status === 'captured';
      
      setVerificationResult({
        success: statusResult.success,
        verified: isVerified,
        error: statusResult.error || statusResult.reason
      });
      
      if (isVerified) {
        console.log("Payment captured successfully");
        if (setPaymentCompleted) {
          setPaymentCompleted(true);
        }
        setIsProcessing(false);
      } else if (statusResult.status === 'failed') {
        console.log("Payment failed");
        setIsProcessing(false);
      }
    }
  }, [statusResult, setPaymentCompleted, setIsProcessing]);

  // Auto-start verification when we have order details
  useEffect(() => {
    if (orderId && !verificationResult && !isPolling) {
      setIsVerifying(true);
      console.log("Starting payment verification for order:", orderId);
      
      // Start polling for payment status
      startPolling();
    }
  }, [orderId, verificationResult, isPolling, startPolling]);

  const verifyPayment = async (response: any, amount: number, bookingDetails: BookingDetails, referenceId: string) => {
    try {
      setIsVerifying(true);
      
      console.log("Starting payment status check for order:", response.razorpay_order_id);
      
      // Start polling for the payment status
      startPolling();
      
      return { success: true, verified: false }; // Will be updated via polling
    } catch (error) {
      console.error("Error starting payment verification:", error);
      setIsVerifying(false);
      setIsProcessing(false);
      return { success: false, verified: false };
    }
  };

  return { 
    verifyPayment, 
    isVerifying: isVerifying || isPolling, 
    verificationResult 
  };
};
