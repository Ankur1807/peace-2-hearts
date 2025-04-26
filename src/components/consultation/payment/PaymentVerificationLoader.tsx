
import { Loader2 } from "lucide-react";

const PaymentVerificationLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-peacefulBlue mb-6" />
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Confirming Your Payment
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        We are verifying your payment with Razorpay. This might take a few seconds.
        Please do not close or refresh the page.
      </p>
    </div>
  );
};

export default PaymentVerificationLoader;
