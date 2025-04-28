
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { BookingDetails } from '@/utils/types';

interface NavigateToVerificationParams {
  paymentId: string;
  orderId: string;
  amount: number;
  referenceId: string;
  bookingDetails?: BookingDetails;
  isVerifying?: boolean;
  verificationFailed?: boolean;
}

export const usePaymentNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigateToVerification = ({
    paymentId,
    orderId,
    amount,
    referenceId,
    bookingDetails,
    isVerifying = true,
    verificationFailed = false
  }: NavigateToVerificationParams) => {
    navigate("/payment-verification", {
      state: {
        paymentId,
        orderId,
        amount,
        referenceId,
        bookingDetails,
        isVerifying,
        verificationFailed
      },
      replace: true
    });
  };

  const handlePaymentError = (error: any, paymentId: string, orderId: string, amount: number, referenceId: string, bookingDetails?: BookingDetails) => {
    console.error("Payment failed:", error);
    
    if (error?.metadata?.payment_id) {
      navigateToVerification({
        paymentId: error.metadata.payment_id,
        orderId,
        amount,
        referenceId,
        bookingDetails,
        isVerifying: false,
        verificationFailed: true
      });
    }
    
    toast({
      title: "Payment Failed",
      description: error.description || "Your payment could not be processed. Please try again.",
      variant: "destructive"
    });
  };

  return {
    navigateToVerification,
    handlePaymentError
  };
};
