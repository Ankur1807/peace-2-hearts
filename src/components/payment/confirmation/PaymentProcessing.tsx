
import { Loader2 } from "lucide-react";

interface PaymentProcessingProps {
  isVerifying: boolean;
  isRecovering: boolean;
}

const PaymentProcessing = ({ isVerifying, isRecovering }: PaymentProcessingProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue mb-4" />
      <h1 className="text-2xl font-semibold mb-2">
        {isVerifying ? "Verifying Your Payment" : "Recovering Your Booking"}
      </h1>
      <p className="text-gray-700">
        {isVerifying 
          ? "Please wait while we verify your payment details..." 
          : "Please wait while we recover your booking information..."}
      </p>
    </div>
  );
};

export default PaymentProcessing;
