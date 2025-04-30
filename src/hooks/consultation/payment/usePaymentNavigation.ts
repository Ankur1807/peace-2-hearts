
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';

interface NavigateToVerificationProps {
  paymentId: string;
  orderId: string;
  signature: string;
  amount: number;
  referenceId: string;
  bookingDetails: BookingDetails;
  isVerifying?: boolean;
  verificationFailed?: boolean;
}

export const usePaymentNavigation = () => {
  const navigate = useNavigate();

  const navigateToVerification = ({
    paymentId,
    orderId,
    signature,
    amount,
    referenceId,
    bookingDetails,
    isVerifying = false,
    verificationFailed = false
  }: NavigateToVerificationProps) => {
    console.log('Navigating to verification page with:', { referenceId, paymentId });
    
    // Create search params for the URL
    const searchParams = new URLSearchParams();
    if (referenceId) searchParams.set('ref', referenceId);
    if (paymentId) searchParams.set('pid', paymentId);
    
    // Also pass state for backward compatibility
    navigate(`/payment-verification`, {
      state: {
        paymentId,
        orderId,
        signature,
        amount,
        referenceId,
        bookingDetails,
        isVerifying,
        verificationFailed
      },
      replace: true
    });
  };

  const handlePaymentError = (error: any, referenceId?: string) => {
    console.error('Payment error:', error);
    
    const searchParams = new URLSearchParams();
    if (referenceId) searchParams.set('ref', referenceId);
    
    navigate(`/payment-confirmation?${searchParams.toString()}`, {
      state: {
        paymentFailed: true,
        error: error.description || 'Payment processing failed',
        referenceId
      },
      replace: true
    });
  };

  return {
    navigateToVerification,
    handlePaymentError
  };
};
