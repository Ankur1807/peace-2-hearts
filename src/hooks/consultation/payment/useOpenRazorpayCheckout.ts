
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
          
          // Navigation parameters for both primary and fallback navigation
          const navigationParams = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            amount: price,
            referenceId: receiptId
          };
          
          // Primary navigation method using React Router
          navigate("/thank-you", { 
            state: {
              ...navigationParams,
              bookingDetails
            },
            replace: true 
          });
          
          console.log("[PAYMENT FLOW] ✅ Navigation command executed");
          
          // Set a fallback in case navigate fails silently (happens in some scenarios)
          setTimeout(() => {
            // Check if we're still on the same page after navigation attempt
            if (window.location.pathname.indexOf('/thank-you') === -1) {
              console.log("[PAYMENT FLOW] ⚠️ Navigate may have failed, using fallback URL redirection");
              // Construct URL parameters for fallback
              const params = new URLSearchParams({
                ref: receiptId,
                pid: response.razorpay_payment_id,
                oid: response.razorpay_order_id
              });
              window.location.href = `/thank-you?${params.toString()}`;
            }
          }, 500);
        } catch (navError) {
          console.error("[PAYMENT FLOW] ❌ Navigation error:", navError);
          
          // If navigation fails, use window.location as fallback
          console.log("[PAYMENT FLOW] 🔄 Using fallback navigation via window.location");
          window.location.href = `/thank-you?ref=${receiptId}&pid=${response.razorpay_payment_id}`;
        }
        
        return; // Exit early after navigation
      } else {
        // If verification failed, show toast and navigate to verification page
        console.warn("[PAYMENT FLOW] ❌ Verification result was not successful:", verificationResult);
        
        toast({
          title: "Payment Verification Failed",
          description: "Your payment was received, but verification failed. Please contact support.",
          variant: "destructive"
        });
        
        navigateToVerification({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          amount: price,
          referenceId: receiptId,
          bookingDetails,
          isVerifying: false,
          verificationFailed: true
        });
        
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("[PAYMENT FLOW] ❌ Error in payment success handler:", error);
      
      // Show toast error
      toast({
        title: "Payment Processing Error",
        description: "There was an error processing your payment. Please contact support.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
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
