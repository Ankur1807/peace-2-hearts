
import { useNavigate } from 'react-router-dom';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentStorageService';
import { usePaymentNavigation } from '../payment/usePaymentNavigation';
import { usePaymentVerification } from './usePaymentVerification';
import { useConsultationState } from '../useConsultationState';

interface UseOpenRazorpayCheckoutProps {
  getEffectivePrice: () => number;
  state: any;
  setIsProcessing: (isProcessing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  toast: any;
}

export const useOpenRazorpayCheckout = ({
  getEffectivePrice,
  state,
  setIsProcessing,
  setPaymentCompleted,
  setReferenceId,
  toast
}: UseOpenRazorpayCheckoutProps) => {
  const { navigateToVerification, handlePaymentError } = usePaymentNavigation();
  const navigate = useNavigate();
  
  const { verifyPayment, isVerifying } = usePaymentVerification({
    setIsProcessing,
    setPaymentCompleted
  });
  
  const handleSuccess = async (response: any, receiptId: string) => {
    try {
      console.log("Payment successful, processing verification:", response);
      
      // Create booking details object
      const bookingDetails = {
        clientName: `${state.personalDetails.firstName || ''} ${state.personalDetails.lastName || ''}`.trim(),
        email: state.personalDetails.email,
        phone: state.personalDetails.phone,
        referenceId: receiptId,
        consultationType: state.serviceCategory,
        services: state.selectedServices || [state.serviceCategory],
        date: state.date,
        timeSlot: state.timeSlot,
        timeframe: state.timeframe,
        message: state.personalDetails.message,
        serviceCategory: state.serviceCategory,
        amount: getEffectivePrice()
      };
      
      // Store payment details in session for recovery if needed
      storePaymentDetailsInSession({
        referenceId: receiptId,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        amount: getEffectivePrice(),
        bookingDetails
      });
      
      if (setReferenceId) {
        setReferenceId(receiptId);
      }
      
      // CRITICAL FIX: Always immediately navigate to verification page with query parameters
      // This ensures we don't go back to the cart page after Razorpay closes
      const searchParams = new URLSearchParams();
      searchParams.set('ref', receiptId); // Always include the reference ID
      searchParams.set('pid', response.razorpay_payment_id);
      
      console.log(`Immediately redirecting to verification with params: ${searchParams.toString()}`);
      
      // Navigate to verification page IMMEDIATELY after payment success
      navigateToVerification({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        amount: getEffectivePrice(),
        referenceId: receiptId,
        bookingDetails,
        isVerifying: true // Set to true to indicate verification in progress
      });
      
      // Start verification process in the background
      const verificationResult = await verifyPayment(
        response, 
        getEffectivePrice(), 
        bookingDetails, 
        receiptId
      );
      
      // If verification failed but we've already navigated, we need to update the state
      if (!verificationResult.success) {
        toast({
          title: "Payment Verification Warning",
          description: "Your payment was received, but we're having trouble with our system. Please contact support if you don't receive a confirmation email.",
          variant: "warning"
        });
      }
      
    } catch (error) {
      console.error("Error in payment success handler:", error);
      
      // Even if an error occurs, navigate to confirmation with warning state
      // CRITICAL FIX: Always include reference ID in navigation
      navigateToVerification({
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        amount: getEffectivePrice(),
        referenceId: receiptId,
        bookingDetails: {
          clientName: `${state.personalDetails.firstName || ''} ${state.personalDetails.lastName || ''}`.trim(),
          email: state.personalDetails.email,
          referenceId: receiptId,
          consultationType: state.serviceCategory,
          services: state.selectedServices || [state.serviceCategory],
          serviceCategory: state.serviceCategory,
          date: state.date,
          timeSlot: state.timeSlot,
          timeframe: state.timeframe,
          amount: getEffectivePrice()
        },
        isVerifying: false,
        verificationFailed: true
      });
      
      toast({
        title: "Payment Processing Warning",
        description: "Your payment was received, but we couldn't complete the booking process. Please contact support.",
        variant: "warning"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const openRazorpayCheckout = (order: any, razorpayKey: string, receiptId: string) => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay not available');
      }
      
      const options = {
        key: razorpayKey,
        amount: getEffectivePrice() * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Peace2Hearts',
        description: `Consultation Booking: ${receiptId}`,
        order_id: order.id,
        handler: (response: any) => {
          // CRITICAL FIX: Immediately call our handler to redirect on Razorpay closure
          console.log("Payment successful - Razorpay handler triggered");
          handleSuccess(response, receiptId);
        },
        prefill: {
          name: `${state.personalDetails.firstName || ''} ${state.personalDetails.lastName || ''}`.trim(),
          email: state.personalDetails.email,
          contact: state.personalDetails.phone || ''
        },
        notes: {
          reference_id: receiptId,
          consultationType: state.selectedServices[0] || state.serviceCategory
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            console.log("Payment dismissed");
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You've cancelled your payment. You can try again when you're ready.",
              variant: "default"
            });
          },
          // CRITICAL FIX: Override escape key to prevent accidental closing without redirect
          escape: false,
          // CRITICAL FIX: Force backdrop to stay until handled properly
          backdropclose: false
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
      console.log("Razorpay checkout opened with reference ID:", receiptId);
      
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
      setIsProcessing(false);
      toast({
        title: "Payment Gateway Error",
        description: "Could not open payment gateway. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return openRazorpayCheckout;
};
