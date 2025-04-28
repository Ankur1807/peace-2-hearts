import { verifyRazorpayPayment, savePaymentRecord } from '@/utils/payment/razorpayService';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentRecordService';

interface OpenRazorpayCheckoutArgs {
  getEffectivePrice: () => number;
  state: any;
  setIsProcessing: (processing: boolean) => void;
  setPaymentCompleted?: (completed: boolean) => void;
  setReferenceId?: (id: string) => void;
  handleConfirmBooking?: () => Promise<void>;
  toast: any;
}

export const useOpenRazorpayCheckout = ({
  getEffectivePrice,
  state,
  setIsProcessing,
  setPaymentCompleted,
  setReferenceId,
  handleConfirmBooking,
  toast,
}: OpenRazorpayCheckoutArgs) => {
  const navigate = useNavigate();
  
  return (order: any, razorpayKey: string, receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    console.log("Opening Razorpay checkout with reference ID:", receiptId);
    
    // Set reference ID early in the process
    if (setReferenceId) {
      setReferenceId(receiptId);
    }
    
    // Create booking details object for passing between pages
    const createBookingDetails = (): BookingDetails => ({
      clientName: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
      email: state.personalDetails.email,
      referenceId: receiptId,
      consultationType: state.selectedServices.length > 1 ? 'multiple' : state.selectedServices[0],
      services: state.selectedServices || [],
      date: state.serviceCategory === 'holistic' ? undefined : state.date,
      timeSlot: state.serviceCategory === 'holistic' ? undefined : state.timeSlot,
      timeframe: state.serviceCategory === 'holistic' ? state.timeframe : undefined,
      packageName: state.serviceCategory === 'holistic' ? 
        (state.selectedServices.includes('divorce-prevention') ? 'Divorce Prevention Package' : 
        state.selectedServices.includes('pre-marriage-clarity') ? 'Pre-Marriage Clarity Package' : null) : null,
      serviceCategory: state.serviceCategory,
      amount: effectivePrice,
      message: state.personalDetails.message,
      phone: state.personalDetails.phone
    });
    
    // Store booking details in session storage early
    const bookingDetails = createBookingDetails();
    storePaymentDetailsInSession(receiptId, '', order.id, effectivePrice, bookingDetails);
    
    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: "Peace2Hearts",
      description: `Payment for consultation services`,
      order_id: order.id,
      handler: async function (response: any) {
        console.log("Payment successful:", response);
        
        try {
          // Show processing loader immediately
          setIsProcessing(true);
          
          // Update session storage with payment ID
          storePaymentDetailsInSession(
            receiptId, 
            response.razorpay_payment_id, 
            response.razorpay_order_id, 
            effectivePrice,
            bookingDetails
          );
          
          // Create consultation record first
          if (handleConfirmBooking) {
            console.log("Creating consultation record...");
            await handleConfirmBooking();
          }
          
          // Verify payment with increased timeout
          const verificationPromise = new Promise<boolean>(async (resolve) => {
            // Add delay for better UX and to ensure payment processing
            await new Promise(r => setTimeout(r, 5000));
            
            const isVerified = await verifyRazorpayPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });
            
            resolve(isVerified);
          });
          
          const isVerified = await verificationPromise;
          console.log("Payment verification result:", isVerified);
          
          if (isVerified) {
            // Save payment record with high priority
            const paymentSaved = await savePaymentRecord({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId,
              status: 'completed',
              bookingDetails: bookingDetails,
              highPriority: true
            });
            
            console.log("Payment record saved:", paymentSaved);
            
            if (setPaymentCompleted) {
              setPaymentCompleted(true);
            }
            
            // Navigate to confirmation with loading state
            navigate("/payment-verification", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId,
                bookingDetails: bookingDetails,
                isVerifying: true
              },
              replace: true
            });
          } else {
            toast({
              title: "Payment Verification Failed",
              description: "We couldn't verify your payment. Please contact support.",
              variant: "destructive"
            });
            
            navigate("/payment-verification", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId,
                bookingDetails: bookingDetails,
                verificationFailed: true
              },
              replace: true
            });
          }
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          navigate("/payment-verification", {
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId,
              bookingDetails: bookingDetails,
              error: "Error processing payment"
            },
            replace: true
          });
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`,
        email: state.personalDetails.email,
        contact: state.personalDetails.phone,
      },
      notes: {
        services: state.selectedServices.join(','),
        consultationId: receiptId,
        client: `${state.personalDetails.firstName} ${state.personalDetails.lastName}`
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed");
          setIsProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
          });
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        
        if (response.error && response.error.metadata && response.error.metadata.payment_id) {
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.error.metadata.payment_id,
              orderId: order.id,
              amount: effectivePrice,
              referenceId: receiptId,
              bookingDetails: bookingDetails,
              paymentFailed: true
            },
            replace: true
          });
        }
        
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment could not be processed. Please try again.",
        });
        setIsProcessing(false);
      });
      
      console.log("Opening Razorpay payment modal with options:", {
        key: options.key,
        orderId: options.order_id,
        amount: options.amount,
        currency: options.currency,
        notes: options.notes
      });
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      setIsProcessing(false);
      throw new Error("Failed to initialize payment gateway");
    }
  };
};
