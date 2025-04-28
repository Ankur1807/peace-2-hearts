
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { BookingDetails } from "@/utils/types";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePaymentRecovery } from "@/hooks/consultation/usePaymentRecovery";
import { usePaymentConfirmation } from "@/hooks/payment/usePaymentConfirmation";
import PaymentProcessing from "@/components/payment/confirmation/PaymentProcessing";
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
  
  const { isVerifying, verificationResult } = usePaymentConfirmation({
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
          console.log("Attempting to recover booking data for reference ID:", referenceId);
          const consultationData = await fetchConsultationData(referenceId);
          
          if (consultationData) {
            console.log("Successfully recovered consultation data:", consultationData);
            const recoveredBookingDetails = createBookingDetailsFromConsultation(consultationData);
            
            if (recoveredBookingDetails) {
              console.log("Created booking details from recovered data:", recoveredBookingDetails);
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
          <div className="max-w-4xl mx-auto px-4 py-10">
            <Card className="p-8 mb-6">
              <Alert variant={verificationResult.success ? "default" : "destructive"} className="mb-6">
                <AlertTitle className="text-xl font-lora">
                  {verificationResult.success ? "Payment Verified" : "Verification Issue"}
                </AlertTitle>
                <AlertDescription className="text-lg">{verificationResult.message}</AlertDescription>
              </Alert>
              
              {verificationResult.success ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold font-lora">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-500 text-sm">Payment ID</p>
                        <p className="font-medium">{paymentId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Order ID</p>
                        <p className="font-medium">{orderId || "N/A"}</p>
                      </div>
                      {amount > 0 && (
                        <div>
                          <p className="text-gray-500 text-sm">Amount Paid</p>
                          <p className="font-medium">₹{amount}</p>
                        </div>
                      )}
                      {referenceId && (
                        <div>
                          <p className="text-gray-500 text-sm">Reference ID</p>
                          <p className="font-medium">{referenceId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {recoveryResult && (
                    <Alert variant={recoveryResult.success ? "default" : "destructive"} className="my-4">
                      <AlertTitle>{recoveryResult.success ? "Recovery Successful" : "Recovery Issue"}</AlertTitle>
                      <AlertDescription>{recoveryResult.message}</AlertDescription>
                    </Alert>
                  )}
                  
                  {bookingDetails ? (
                    <BookingSuccessView
                      referenceId={referenceId}
                      bookingDetails={bookingDetails}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4">Your payment has been successfully processed.</p>
                      {bookingRecovered ? (
                        <p className="mb-6 text-green-600">
                          Your booking record has been successfully recovered.
                        </p>
                      ) : (
                        <>
                          <p className="mb-6 text-amber-600">
                            We couldn't find complete booking details, but your payment has been recorded. 
                            {!recoveryResult && " You may not have received a confirmation email yet."}
                          </p>
                          {!recoveryResult && (
                            <Button 
                              onClick={handleManualRecovery} 
                              className="mb-6 bg-peacefulBlue hover:bg-peacefulBlue/90"
                            >
                              Resend Confirmation Email
                            </Button>
                          )}
                        </>
                      )}
                      <Button onClick={() => navigate('/')}>Return to Home</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
                  <p className="mb-4">Order ID: <strong>{orderId || "N/A"}</strong></p>
                  <p className="mb-6">Please save these details for your reference when contacting support.</p>
                  <div className="space-y-3">
                    <Button onClick={() => navigate('/book-consultation')} className="w-full sm:w-auto">
                      Try Booking Again
                    </Button>
                    <div className="pt-2">
                      <Button onClick={() => navigate('/')} variant="outline" className="w-full sm:w-auto">
                        Return to Home
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
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
