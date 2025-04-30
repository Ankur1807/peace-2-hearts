
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
      console.log("[PAYMENT FLOW] ✅ Payment successful, processing verification:", response);
      
      // Calculate the effective price
      const price = getEffectivePrice();
      console.log(`[PAYMENT FLOW] Effective price for checkout: ${price}`);
      
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
        amount: price
      };
      
      // Debug logs
      console.log("[PAYMENT FLOW] Booking date:", state.date);
      if (state.date instanceof Date) {
        console.log("[PAYMENT FLOW] Date ISO string:", state.date.toISOString());
      }
      console.log("[PAYMENT FLOW] Timeslot:", state.timeSlot);
      
      // Store payment details in session for recovery if needed
      storePaymentDetailsInSession({
        referenceId: receiptId,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        amount: price,
        bookingDetails
      });
      
      if (setReferenceId) {
        setReferenceId(receiptId);
      }
      
      console.log("[PAYMENT FLOW] 🔄 Calling verifyPayment with payment ID:", response.razorpay_payment_id);
      
      // Start verification process
      const verificationResult = await verifyPayment(
        response, 
        price, 
        bookingDetails, 
        receiptId
      );
      
      console.log("[PAYMENT FLOW] 📝 Verification result:", JSON.stringify(verificationResult));
      
      // Navigate based on verification result - immediately redirect on verification success
      if (verificationResult && verificationResult.success) {
        console.log("[PAYMENT FLOW] ✅ Payment verification successful, navigating to thank-you page");
        
        try {
          console.log("[PAYMENT FLOW] 🔄 Executing navigation to thank-you page");
          
          // Navigate to the thank you page with all necessary data
          navigate("/thank-you", { 
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: price,
              referenceId: receiptId,
              bookingDetails
            },
            replace: true 
          });
          
          console.log("[PAYMENT FLOW] ✅ Navigation command executed");
          
          // Fallback in case navigate fails silently
          setTimeout(() => {
            if (window.location.pathname.indexOf('/thank-you') === -1) {
              console.log("[PAYMENT FLOW] ⚠️ Navigate may have failed, using fallback URL redirection");
              window.location.href = `/thank-you?ref=${receiptId}&pid=${response.razorpay_payment_id}`;
            }
          }, 300);
          
          return;
        } catch (navError) {
          console.error("[PAYMENT FLOW] ❌ Navigation error:", navError);
          
          // Use window.location as fallback
          console.log("[PAYMENT FLOW] 🔄 Using fallback navigation via window.location");
          window.location.href = `/thank-you?ref=${receiptId}&pid=${response.razorpay_payment_id}`;
          
          return;
        }
      } else {
        // Show error toast and navigate to verification page if verification failed
        console.warn("[PAYMENT FLOW] ❌ Verification result was not successful:", verificationResult);
        
        toast({
          title: "Payment Received",
          description: "Your payment was received but verification is pending. We will process your booking soon.",
          variant: "default"
        });
        
        // Navigate to verification page to allow manual verification
        navigateToVerification({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: price,
          referenceId: receiptId,
          bookingDetails,
          isVerifying: false,
          verificationFailed: false
        });
        
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("[PAYMENT FLOW] ❌ Error in payment success handler:", error);
      
      // Show toast error
      toast({
        title: "Payment Processing",
        description: "Your payment is being processed. If you don't receive a confirmation, please contact support.",
        variant: "default"
      });
      
      setIsProcessing(false);
      
      // Navigate to thank you page as fallback
      setTimeout(() => {
        navigate("/thank-you", { replace: true });
      }, 3000);
    }
  };
  
  const openRazorpayCheckout = (order: any, razorpayKey: string, receiptId: string) => {
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay not available');
      }
      
      // Get the effective price, making sure it's positive and non-zero
      const price = getEffectivePrice();
      const effectivePrice = Math.max(price, 50); // Ensure minimum price of ₹50
      
      console.log(`[PAYMENT FLOW] Opening Razorpay checkout with price: ₹${effectivePrice}`);
      
      const options = {
        key: razorpayKey,
        amount: effectivePrice * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Peace2Hearts',
        description: `Consultation Booking: ${receiptId}`,
        order_id: order.id,
        handler: (response: any) => {
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
            console.log("[PAYMENT FLOW] Payment dismissed");
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You've cancelled your payment. You can try again when you're ready.",
              variant: "default"
            });
          }
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
      console.log("[PAYMENT FLOW] Razorpay checkout opened");
      
    } catch (error) {
      console.error("[PAYMENT FLOW] Error opening Razorpay checkout:", error);
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
