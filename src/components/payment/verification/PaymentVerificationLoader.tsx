
import { Loader2 } from "lucide-react";

const PaymentVerificationLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue mb-4" />
      <h1 className="text-2xl font-semibold mb-2">Verifying Your Payment</h1>
      <p className="text-gray-700">Please wait while we verify your payment details...</p>
    </div>
  );
};

export default PaymentVerificationLoader;
