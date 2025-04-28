
import { verifyRazorpayPayment } from '@/utils/payment/razorpayService';
import { useNavigate } from 'react-router-dom';
import { BookingDetails } from '@/utils/types';
import { storePaymentDetailsInSession } from '@/utils/payment/services/paymentRecordService';
import { useRazorpayInit } from './useRazorpayInit';
import { usePaymentRecord } from './usePaymentRecord';
import { useCheckoutOptions } from './useCheckoutOptions';

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
  const { initializeRazorpay } = useRazorpayInit();
  const { createPaymentRecord } = usePaymentRecord();
  const { createCheckoutOptions } = useCheckoutOptions();
  
  return async (order: any, razorpayKey: string, receiptId: string) => {
    const effectivePrice = getEffectivePrice();
    console.log("Opening Razorpay checkout with reference ID:", receiptId);
    
    if (setReferenceId) {
      setReferenceId(receiptId);
    }
    
    const bookingDetails = {
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
    };
    
    storePaymentDetailsInSession(receiptId, '', order.id, effectivePrice, bookingDetails);

    const options = createCheckoutOptions({
      razorpayKey,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      personalDetails: state.personalDetails,
      selectedServices: state.selectedServices,
      receiptId
    });

    try {
      const isLoaded = await initializeRazorpay();
      if (!isLoaded) return;

      const razorpay = new window.Razorpay({
        ...options,
        handler: async function (response: any) {
          console.log("Payment successful:", response);
          
          try {
            setIsProcessing(true);
            
            if (handleConfirmBooking) {
              console.log("Creating consultation record...");
              await handleConfirmBooking();
            }
            
            const verificationPromise = new Promise<boolean>(async (resolve) => {
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
              const paymentSaved = await createPaymentRecord({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: effectivePrice,
                referenceId: receiptId,
                bookingDetails
              });
              
              if (setPaymentCompleted) {
                setPaymentCompleted(true);
              }
              
              navigate("/payment-verification", {
                state: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: effectivePrice,
                  referenceId: receiptId,
                  bookingDetails,
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
                  bookingDetails,
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
                bookingDetails,
                error: "Error processing payment"
              },
              replace: true
            });
          } finally {
            setIsProcessing(false);
          }
        }
      });
      
      razorpay.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        
        if (response.error?.metadata?.payment_id) {
          navigate("/payment-confirmation", {
            state: {
              paymentId: response.error.metadata.payment_id,
              orderId: order.id,
              amount: effectivePrice,
              referenceId: receiptId,
              bookingDetails,
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
      
      razorpay.open();
    } catch (err) {
      console.error("Error initializing Razorpay:", err);
      setIsProcessing(false);
      throw new Error("Failed to initialize payment gateway");
    }
  };
};
