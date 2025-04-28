
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentStatusMessageProps {
  success: boolean;
  message: string;
  paymentId?: string | null;
  orderId?: string | null;
}

const PaymentStatusMessage = ({ success, message, paymentId, orderId }: PaymentStatusMessageProps) => {
  const navigate = useNavigate();

  if (success) {
    return (
      <Alert variant="default" className="mb-6">
        <AlertTitle className="text-xl font-lora">Payment Verified</AlertTitle>
        <AlertDescription className="text-lg">{message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="text-center">
      {paymentId && <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>}
      {orderId && <p className="mb-4">Order ID: <strong>{orderId}</p>}
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
  );
};

export default PaymentStatusMessage;
