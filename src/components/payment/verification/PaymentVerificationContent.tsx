import { VerificationResult } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentVerificationContentProps {
  verificationResult: VerificationResult;
  paymentId: string | null;
  orderId: string | null;
  amount: number;
  referenceId: string | null;
  onManualRecovery?: () => void;
  isSuccess: boolean;
}

const PaymentVerificationContent = ({
  verificationResult,
  paymentId,
  orderId,
  amount,
  referenceId,
  onManualRecovery,
  isSuccess
}: PaymentVerificationContentProps) => {
  return (
    <div className="text-center">
      {isSuccess ? (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Payment Verified!</h2>
          <p className="text-gray-600 mb-4">{verificationResult.message}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm">
              <strong>Payment ID:</strong> {paymentId}<br />
              {referenceId && <><strong>Reference:</strong> {referenceId}<br /></>}
              <strong>Amount:</strong> ₹{amount}
            </p>
          </div>
          <Link to="/payment-confirmation">
            <Button className="bg-peacefulBlue hover:bg-peacefulBlue/80">
              Continue to Confirmation <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </>
      ) : (
        <>
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-4">{verificationResult.message}</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm">
              <strong>Payment ID:</strong> {paymentId}<br />
              {referenceId && <><strong>Reference:</strong> {referenceId}<br /></>}
              <strong>Amount:</strong> ₹{amount}
            </p>
          </div>
          {onManualRecovery && (
            <Button onClick={onManualRecovery} variant="outline" className="mb-4">
              Attempt Manual Recovery
            </Button>
          )}
          <Link to="/">
            <Button variant="secondary">Return to Home</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default PaymentVerificationContent;
