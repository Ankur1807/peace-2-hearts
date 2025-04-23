
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";
import { verifyAndSyncPayment } from "@/utils/payment/razorpayService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Accept either query params or state for flexibility
const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try getting from state first (safer), fall back to search params
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);

  // If we have a payment ID but no booking details, try to verify and recover the payment
  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId && !bookingDetails) {
        setIsVerifying(true);
        try {
          const verified = await verifyAndSyncPayment(paymentId);
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
  }, [paymentId, bookingDetails]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Verifying Your Payment</h1>
        <p className="text-gray-700">
          Please wait while we verify your payment details...
        </p>
      </div>
    );
  }

  if (verificationResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Alert variant={verificationResult.success ? "default" : "destructive"} className="mb-6">
          <AlertTitle className="text-xl">{verificationResult.success ? "Payment Verified" : "Verification Issue"}</AlertTitle>
          <AlertDescription className="text-lg">{verificationResult.message}</AlertDescription>
        </Alert>
        
        {verificationResult.success ? (
          <div className="mt-6 text-center">
            <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
            <p className="mb-6">Your payment has been recorded in our system.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
            <p className="mb-6">Please save this payment ID for your reference.</p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        )}
      </div>
    );
  }

  if (!referenceId && !bookingDetails && !paymentId) {
    return (
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
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BookingSuccessView
        referenceId={referenceId}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};

export default PaymentConfirmation;
