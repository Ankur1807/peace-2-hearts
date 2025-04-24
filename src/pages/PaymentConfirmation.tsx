
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";
import { verifyAndSyncPayment } from "@/utils/payment/razorpayService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { checkPaymentExists, savePaymentDetails } from "@/utils/payment/paymentStorage";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

// Accept either query params or state for flexibility
const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try getting from state first (safer), fall back to search params
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  const orderId = searchParams.get("razorpay_order_id") || location.state?.orderId;
  const amount = location.state?.amount || 0;
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);

  // Debug what data we have
  useEffect(() => {
    console.log("Payment Confirmation Page loaded with:", { 
      referenceId, 
      paymentId, 
      orderId, 
      amount,
      hasBookingDetails: !!bookingDetails
    });
  }, [referenceId, paymentId, orderId, amount, bookingDetails]);

  // If we have a payment ID but no booking details, try to verify and recover the payment
  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId) {
        setIsVerifying(true);
        try {
          // First check if the payment is already in our database
          const paymentExists = await checkPaymentExists(paymentId);
          
          if (paymentExists) {
            console.log("Payment already exists in database");
            setVerificationResult({
              success: true,
              message: "Your payment has been verified and your booking is confirmed."
            });
            setIsVerifying(false);
            return;
          }
          
          // If payment not in database, verify with Razorpay and try to recover
          console.log("Payment not found in database, attempting to verify and recover");
          const verified = await verifyAndSyncPayment(paymentId);
          
          // If we have enough info to save payment directly, try that as a last resort
          if (!verified && orderId && referenceId && amount > 0) {
            console.log("Attempting direct payment save as last resort");
            const saved = await savePaymentDetails({
              paymentId,
              orderId,
              amount,
              consultationId: referenceId
            });
            
            if (saved) {
              setVerificationResult({
                success: true,
                message: "Your payment has been recorded and your booking is confirmed."
              });
              setIsVerifying(false);
              return;
            }
          }
          
          if (verified) {
            setVerificationResult({
              success: true,
              message: "Your payment has been verified and your booking is confirmed."
            });
          } else {
            setVerificationResult({
              success: false,
              message: "We could not verify your payment. Please contact support with your payment ID."
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          setVerificationResult({
            success: false,
            message: "An error occurred while verifying your payment. Please contact support."
          });
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    verifyPayment();
  }, [paymentId, orderId, referenceId, amount]);

  return (
    <>
      <SEO
        title="Payment Confirmation"
        description="Confirm your booking and payment details for your Peace2Hearts consultation."
        keywords="payment confirmation, booking confirmation, consultation payment"
      />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Verifying Your Payment</h1>
            <p className="text-gray-700">
              Please wait while we verify your payment details...
            </p>
          </div>
        ) : verificationResult ? (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <Alert variant={verificationResult.success ? "default" : "destructive"} className="mb-6">
              <AlertTitle className="text-xl">{verificationResult.success ? "Payment Verified" : "Verification Issue"}</AlertTitle>
              <AlertDescription className="text-lg">{verificationResult.message}</AlertDescription>
            </Alert>
            
            {verificationResult.success ? (
              <div className="mt-6 text-center">
                <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
                <p className="mb-4">Order ID: <strong>{orderId || "N/A"}</strong></p>
                <p className="mb-6">Your payment has been recorded in our system.</p>
                <Button onClick={() => navigate('/')}>Return to Home</Button>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
                <p className="mb-4">Order ID: <strong>{orderId || "N/A"}</strong></p>
                <p className="mb-6">Please save these details for your reference when contacting support.</p>
                <Button onClick={() => navigate('/')}>Return to Home</Button>
              </div>
            )}
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
