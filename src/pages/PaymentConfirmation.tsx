
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { BookingDetails } from "@/utils/types";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { usePaymentRecovery } from "@/hooks/consultation/usePaymentRecovery";
import { usePaymentConfirmation } from "@/hooks/payment/usePaymentConfirmation";
import PaymentProcessing from "@/components/payment/confirmation/PaymentProcessing";
import PaymentConfirmationContainer from "@/components/payment/confirmation/PaymentConfirmationContainer";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { fetchConsultationData, createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  const orderId = searchParams.get("razorpay_order_id") || location.state?.orderId;
  const amount = location.state?.amount || 0;
  const paymentFailed = location.state?.paymentFailed || false;
  const verificationFailed = location.state?.verificationFailed || false;
  
  const [bookingRecovered, setBookingRecovered] = useState(false);
  const { isRecovering, recoveryResult, recoverPaymentAndSendEmail } = usePaymentRecovery();
  
  const { isVerifying, setIsVerifying, verificationResult } = usePaymentConfirmation({
    referenceId,
    paymentId,
    orderId,
    amount,
    paymentFailed,
    verificationFailed,
    setBookingRecovered
  });

  useEffect(() => {
    const recoverBookingData = async () => {
      if (referenceId && !bookingDetails) {
        setIsVerifying(true);
        try {
          const consultationData = await fetchConsultationData(referenceId);
          if (consultationData) {
            const recoveredBookingDetails = createBookingDetailsFromConsultation(consultationData);
            if (recoveredBookingDetails) {
              setBookingRecovered(true);
              navigate(".", { 
                state: {
                  ...location.state,
                  bookingDetails: recoveredBookingDetails
                },
                replace: true
              });
              toast({
                title: "Booking Details Recovered",
                description: "We've successfully retrieved your booking information."
              });
            }
          }
        } catch (error) {
          console.error("Error in booking data recovery:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    recoverBookingData();
  }, [referenceId, bookingDetails, toast, navigate, location.state]);

  const handleManualRecovery = async () => {
    if (referenceId && paymentId && amount > 0) {
      await recoverPaymentAndSendEmail(referenceId, paymentId, amount, orderId);
    } else {
      toast({
        title: "Recovery Failed",
        description: "Missing required information for recovery",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEO
        title="Payment Confirmation"
        description="Confirm your booking and payment details for your Peace2Hearts consultation."
        keywords="payment confirmation, booking confirmation, consultation payment"
      />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {isVerifying || isRecovering ? (
          <PaymentProcessing 
            isVerifying={isVerifying} 
            isRecovering={isRecovering} 
          />
        ) : verificationResult ? (
          <PaymentConfirmationContainer
            verificationResult={verificationResult}
            paymentId={paymentId}
            orderId={orderId}
            amount={amount}
            referenceId={referenceId}
            bookingDetails={bookingDetails}
            bookingRecovered={bookingRecovered}
            recoveryResult={recoveryResult}
            onManualRecovery={handleManualRecovery}
          />
        ) : (!referenceId && !bookingDetails && !paymentId) ? (
          <div className="flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Booking Confirmation</h1>
            <p className="text-gray-700 mb-4">
              We received your booking request, but we couldn't find complete details.
            </p>
            <p className="text-gray-700 mb-4">
              If you've made a payment, it should be processed shortly.
            </p>
            <p className="text-gray-500">
              Please check your email for further details!
            </p>
            <Button className="mt-6" onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        ) : (
          <BookingSuccessView
            referenceId={referenceId}
            bookingDetails={bookingDetails}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default PaymentConfirmation;
