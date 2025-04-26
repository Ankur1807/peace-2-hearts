
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";
import { verifyAndSyncPayment } from "@/utils/payment/razorpayService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";

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
      if (paymentId && !verificationResult) {
        setIsVerifying(true);
        try {
          // Verify with Razorpay directly
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
  }, [paymentId, orderId, referenceId, amount, verificationResult]);

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
            <Card className="p-8 mb-6">
              <Alert variant={verificationResult.success ? "default" : "destructive"} className="mb-6">
                <AlertTitle className="text-xl font-lora">{verificationResult.success ? "Payment Verified" : "Verification Issue"}</AlertTitle>
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
                  
                  {bookingDetails ? (
                    <BookingSuccessView
                      referenceId={referenceId}
                      bookingDetails={bookingDetails}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4">Your payment has been successfully processed.</p>
                      <p className="mb-6 text-gray-600">
                        You will receive a confirmation email shortly with your booking details.
                      </p>
                      <Button onClick={() => navigate('/')}>Return to Home</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
                  <p className="mb-4">Order ID: <strong>{orderId || "N/A"}</strong></p>
                  <p className="mb-6">Please save these details for your reference when contacting support.</p>
                  <Button onClick={() => navigate('/')}>Return to Home</Button>
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
