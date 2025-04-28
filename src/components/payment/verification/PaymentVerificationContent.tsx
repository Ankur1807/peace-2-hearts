
import { VerificationResult } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import PaymentErrorMessage from "@/components/consultation/payment/PaymentErrorMessage";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";

interface PaymentVerificationContentProps {
  verificationResult: VerificationResult | null;
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  referenceId: string | null;
  bookingDetails?: BookingDetails;
}

const PaymentVerificationContent = ({
  verificationResult,
  paymentId,
  orderId,
  amount,
  referenceId,
  bookingDetails
}: PaymentVerificationContentProps) => {
  const navigate = useNavigate();

  if (!verificationResult) return null;

  return (
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
            <div className="mt-2 text-sm text-gray-600">
              <p>Please save these details for your reference. You will also receive a confirmation email shortly.</p>
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
              <p className="mb-6 text-sm text-gray-600">
                You'll be redirected to the confirmation page.
              </p>
              <Button 
                onClick={() => navigate('/payment-confirmation', { 
                  state: {
                    paymentId,
                    orderId,
                    amount,
                    referenceId
                  }
                })}
              >
                View Confirmation
              </Button>
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
  );
};

export default PaymentVerificationContent;
