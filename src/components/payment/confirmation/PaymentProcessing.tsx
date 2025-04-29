
import { Loader2 } from "lucide-react";

interface PaymentProcessingProps {
  isVerifying: boolean;
  isRecovering: boolean;
}

const PaymentProcessing = ({ isVerifying, isRecovering }: PaymentProcessingProps) => {
  const message = isRecovering 
    ? "Recovering your booking information..."
    : "Verifying your payment...";
    
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <Loader2 className="h-12 w-12 animate-spin text-peacefulBlue mb-6" />
      <h1 className="text-2xl font-semibold mb-4">Processing...</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        {message}
        <br />
        Please wait a moment while we complete this process.
      </p>
    </div>
  );
};

export default PaymentProcessing;
