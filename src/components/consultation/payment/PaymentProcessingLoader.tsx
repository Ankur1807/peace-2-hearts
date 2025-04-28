
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const PaymentProcessingLoader = () => {
  const [countdown, setCountdown] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-12 w-12 animate-spin text-peacefulBlue mb-6" />
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Processing Your Payment
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-4">
        Please wait while we verify your payment. This will take {countdown} seconds.
      </p>
      <p className="text-sm text-gray-500">Do not close or refresh this page.</p>
    </div>
  );
};

export default PaymentProcessingLoader;
