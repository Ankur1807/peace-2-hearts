
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createRazorpayOrder } from '@/utils/payment/services/paymentOrderService';
import { verifyRazorpayPayment } from '@/utils/payment/services/paymentVerificationService';
import { generateReferenceId } from '@/utils/referenceGenerator';
import { PersonalDetails } from '@/utils/types';
import { useProcessPayment } from './payment/useProcessPayment';
import { useNavigate } from 'react-router-dom';

interface UseConsultationPaymentParams {
  state: {
    date?: Date;
    timeSlot?: string;
    timeframe?: string;
    serviceCategory?: string;
    selectedServices?: string[];
    personalDetails?: PersonalDetails;
    totalPrice?: number;
    isProcessing?: boolean;
    submitted?: boolean;
    referenceId?: string | null;
    showPaymentStep?: boolean;
  };
  toast: any;
  setIsProcessing?: (isProcessing: boolean) => void;
  setShowPaymentStep?: (show: boolean) => void;
  handleConfirmBooking?: () => Promise<void>;
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing = () => {},
  setShowPaymentStep = () => {},
  handleConfirmBooking = async () => {},
  setReferenceId = () => {}
}: UseConsultationPaymentParams) {
  const { processPaymentWithRazorpay } = useProcessPayment();
  const navigate = useNavigate();
  
  // Function to proceed to payment step
  const proceedToPayment = useCallback(() => {
    const {
      personalDetails,
      selectedServices
    } = state;
    
    console.log("Proceeding to payment step with:", {
      personalDetails: personalDetails ? `${personalDetails.firstName} ${personalDetails.lastName}` : 'None',
      selectedServices: selectedServices ? selectedServices.join(', ') : 'None'
    });

    // Very explicitly set showPaymentStep to true
    setShowPaymentStep(true);
    
    // For debugging, verify state updates
    setTimeout(() => {
      console.log("Verified showPaymentStep state change:", state.showPaymentStep);
    }, 100);
  }, [state, setShowPaymentStep]);

  // Process payment using Razorpay
  const processPayment = useCallback(async () => {
    const {
      serviceCategory,
      selectedServices = [],
      date,
      timeSlot,
      timeframe,
      personalDetails,
      totalPrice = 0
    } = state;
    
    if (!personalDetails) {
      toast({
        title: "Missing Information",
        description: "Please complete your personal details.",
        variant: "destructive"
      });
      return;
    }

    if (selectedServices.length === 0) {
      toast({
        title: "No Service Selected",
        description: "Please select at least one service.",
        variant: "destructive"
      });
      return;
    }

    const receiptId = state.referenceId || generateReferenceId();
    
    // Preserve the reference ID for later use
    if (!state.referenceId) {
      console.log("Generated new reference ID:", receiptId);
      setReferenceId(receiptId);
    } else {
      console.log("Using existing reference ID:", receiptId);
    }

    const consultationType = selectedServices.join(',');

    // Start showing loading state
    setIsProcessing(true);
    
    try {
      console.log("Processing payment with the following data:", {
        serviceType: consultationType,
        clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
        referenceId: receiptId,
        amount: totalPrice,
        date: date?.toISOString(),
        timeSlot,
        timeframe
      });

      // For holistic packages, we use timeframe instead of date/timeSlot
      const isHolisticPackage = consultationType.includes('divorce-prevention') || 
                               consultationType.includes('pre-marriage-clarity') ||
                               consultationType.includes('holistic');
      
      const timeSlotOrTimeframe = isHolisticPackage ? timeframe || 'Not specified' : timeSlot || 'Not specified';
      
      // Fix for date timezone issues - set time to noon to prevent date shifting
      let adjustedDate: Date | undefined;
      if (date) {
        adjustedDate = new Date(date);
        adjustedDate.setHours(12, 0, 0, 0);
        console.log("Original date:", date.toISOString(), "Adjusted date:", adjustedDate.toISOString());
      }

      // Create the Razorpay order
      const orderResponse = await createRazorpayOrder(
        receiptId,
        totalPrice,
        consultationType
      );

      if (!orderResponse || !orderResponse.order || !orderResponse.order.id) {
        throw new Error("Failed to create payment order");
      }
      
      console.log("Created Razorpay order successfully:", orderResponse);
      
      // Process the payment with Razorpay
      processPaymentWithRazorpay({
        razorpayKey: orderResponse.razorpayKey,
        orderId: orderResponse.order.id,
        amount: totalPrice,
        receipt: receiptId,
        name: `${personalDetails.firstName} ${personalDetails.lastName}`,
        email: personalDetails.email,
        phone: personalDetails.phone,
        successCallback: async (response: any) => {
          console.log("Payment successful, starting verification", response);
          
          const verificationResult = await verifyRazorpayPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
            receiptId,
            {
              // Use the adjusted date with noon time
              date: adjustedDate,
              timeSlot: timeSlot || '',
              timeframe: timeframe || '',
              consultationType: consultationType,
              services: selectedServices,
              clientName: `${personalDetails.firstName} ${personalDetails.lastName}`,
              email: personalDetails.email,
              phone: personalDetails.phone,
              message: personalDetails.message,
              referenceId: receiptId,
              amount: totalPrice,
              serviceCategory: serviceCategory
            }
          );

          console.log("Payment verification result:", verificationResult);
          
          if (verificationResult.success && verificationResult.status === 'captured') {
            console.log("Payment verified successfully, calling handleConfirmBooking");
            
            // Complete the booking process
            await handleConfirmBooking();
            
            // Redirect to thank you page
            navigate("/thank-you");
          } else if (verificationResult.status === 'pending_webhook' || verificationResult.status === 'not_found') {
            console.log("Payment still processing, status:", verificationResult.status);
            // Show neutral processing message, don't show error toast
            toast({
              title: "Processing Payment",
              description: "Your payment is being processed. Please wait a moment...",
              variant: "default"
            });
            
            // Continue processing, don't stop loading state
            // The payment verification will continue in the background
          } else if (verificationResult.status === 'failed') {
            console.error("Payment failed:", verificationResult.error);
            toast({
              title: "Payment Failed",
              description: "Your payment could not be processed. Please try again or contact support.",
              variant: "destructive"
            });
            
            setIsProcessing(false);
          } else {
            // Only show error toast for actual errors, not processing states
            console.error("Payment verification error:", verificationResult.error);
            toast({
              title: "Payment Error",
              description: verificationResult.error || "There was an error verifying your payment. Please contact support.",
              variant: "destructive"
            });
            
            setIsProcessing(false);
          }
        },
        errorCallback: (error: any) => {
          console.error("Payment error:", error);
          toast({
            title: "Payment Error",
            description: error.description || "There was an error processing your payment. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
      });
      
    } catch (error: any) {
      console.error("Error in processPayment:", error);
      toast({
        title: "Payment Processing Error",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  }, [state, toast, setIsProcessing, handleConfirmBooking, processPaymentWithRazorpay, setReferenceId, navigate]);

  return {
    proceedToPayment,
    processPayment
  };
}
