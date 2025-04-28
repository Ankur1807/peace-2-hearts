
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { verifyPaymentAndCreateBooking } from '@/utils/payment/verificationService';

export const usePaymentNavigation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const navigateToVerification = ({
    paymentId,
    orderId,
    amount,
    referenceId,
    bookingDetails,
    isVerifying,
    verificationFailed = false
  }: {
    paymentId: string;
    orderId: string;
    amount: number;
    referenceId: string;
    bookingDetails: any;
    isVerifying?: boolean;
    verificationFailed?: boolean;
  }) => {
    // If the verification failed, show an error toast
    if (verificationFailed) {
      toast({
        title: "Payment Verification Failed",
        description: "We couldn't verify your payment. Please contact support with your payment ID.",
        variant: "destructive"
      });
    }

    // Navigate to the confirmation page and pass along all necessary data
    navigate('/payment-confirmation', {
      state: {
        paymentId,
        orderId,
        referenceId,
        amount,
        isVerifying,
        bookingDetails
      },
      replace: true
    });
  };

  const handlePaymentError = async (
    error: any,
    paymentId: string,
    orderId: string,
    amount: number,
    referenceId: string,
    bookingDetails: any
  ) => {
    console.error("Payment error:", error);
    
    // Show error toast
    toast({
      title: "Payment Failed",
      description: error.description || error.message || "Your payment couldn't be processed. Please try again.",
      variant: "destructive"
    });
    
    try {
      // Even if the payment failed, create a record with failed status
      if (paymentId && referenceId) {
        await verifyPaymentAndCreateBooking(
          paymentId,
          orderId,
          undefined, // No signature for failed payments
          {
            ...bookingDetails,
            referenceId
          }
        );
      }
    } catch (err) {
      console.error("Error handling failed payment:", err);
    }
    
    // Navigate to error page or back to booking form
    navigate('/payment-failed', {
      state: {
        error: error.description || error.message,
        paymentId,
        referenceId
      }
    });
  };

  return {
    navigateToVerification,
    handlePaymentError
  };
};
