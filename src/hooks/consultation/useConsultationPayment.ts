import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveConsultation } from '@/utils/consultationApi';
import { createRazorpayOrder } from '@/utils/payment/services/paymentOrderService';
import { verifyRazorpayPayment } from '@/utils/payment/services/paymentVerificationService';
import { generateReferenceId } from '@/utils/referenceGenerator';
import { PersonalDetails } from '@/utils/types';
import { useProcessPayment } from './payment/useProcessPayment';

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
  handleConfirmBooking?: () => Promise<any>; // Updated to Promise<any>
  setReferenceId?: (id: string) => void;
}

export function useConsultationPayment({
  state,
  toast,
  setIsProcessing = () => {},
  setShowPaymentStep = () => {},
  handleConfirmBooking = async () => { return {}; }, // Default return object
  setReferenceId = () => {}
}: UseConsultationPaymentParams) {
  const { processPaymentWithRazorpay } = useProcessPayment();
  
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
      
      // First save the consultation information
      try {
        // Only save new consultation if it doesn't already exist
        if (!state.referenceId) {
          console.log("Saving consultation before payment processing");
          await saveConsultation(
            consultationType,
            isHolisticPackage ? undefined : date,
            timeSlotOrTimeframe,
            personalDetails
          );
        } else {
          console.log("Consultation already exists with reference ID:", state.referenceId);
        }
      } catch (error) {
        console.error("Error saving consultation:", error);
        toast({
          title: "Error Saving Booking",
          description: "There was an error saving your booking information. Please try again.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
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
              date: date instanceof Date ? date.toISOString() : (date || ''),
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
          
          if (verificationResult.success) {
            console.log("Payment verified successfully, calling handleConfirmBooking");
            
            // Complete the booking process and get the booking result
            const bookingResult = await handleConfirmBooking();
            console.log("Booking confirmed with result:", bookingResult);
          } else {
            console.error("Payment verification failed:", verificationResult.message);
            toast({
              title: "Payment Verification Failed",
              description: verificationResult.message || "Please contact support with your reference ID.",
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
  }, [state, toast, setIsProcessing, handleConfirmBooking, processPaymentWithRazorpay, setReferenceId]);

  return {
    proceedToPayment,
    processPayment
  };
}
