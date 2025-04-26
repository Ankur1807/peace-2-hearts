
import { verifyRazorpayPayment, savePaymentRecord } from '@/utils/payment/razorpayService';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';

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
      message: state.personalDetails.message
    });
    
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
          // Save the reference ID if we have the setter function
          if (setReferenceId) {
            console.log("Setting reference ID:", receiptId);
            setReferenceId(receiptId);
          }
          
          // First verify the payment
          const isVerified = await verifyRazorpayPayment({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
          
          console.log("Payment verification result:", isVerified);
          
          if (isVerified) {
            // If payment is verified, save payment record
            const paymentSaved = await savePaymentRecord({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId,
              status: 'completed'
            });
            
            console.log("Payment record saved:", paymentSaved);

            // Now handle booking confirmation - this creates the consultation record
            if (handleConfirmBooking) {
              console.log("Calling handleConfirmBooking to create consultation record");
              await handleConfirmBooking();
              
              if (setPaymentCompleted) {
                setPaymentCompleted(true);
              }
            } else {
              console.warn("handleConfirmBooking function not provided");
            }
            
            // Generate booking details for passing to confirmation page
            const bookingDetails = createBookingDetails();
            
            // Navigate to final confirmation page
            navigate("/payment-confirmation", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId,
                bookingDetails: bookingDetails
              }
            });
          } else {
            // If verification fails, still try to navigate but with error state
            toast({
              title: "Payment Verification Failed",
              description: "We couldn't verify your payment. Please contact support.",
              variant: "destructive"
            });
            
            navigate("/payment-confirmation", {
              state: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId,
                verificationFailed: true
              }
            });
          }
        } catch (error) {
          console.error("Error processing payment confirmation:", error);
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: effectivePrice,
              referenceId: receiptId,
              error: "Error processing payment"
            }
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
              paymentFailed: true
            }
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
      });
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      setIsProcessing(false);
      throw new Error("Failed to initialize payment gateway");
    }
  };
};
