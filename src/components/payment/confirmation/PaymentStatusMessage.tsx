
import React from 'react';
import { CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface PaymentStatusMessageProps {
  success: boolean;
  message: string;
  paymentId?: string | null;
  orderId?: string | null;
}

const PaymentStatusMessage = ({ 
  success, 
  message, 
  paymentId, 
  orderId 
}: PaymentStatusMessageProps) => {
  return (
    <Alert className={`mb-6 ${success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center gap-3">
        {success ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <AlertTitle className={`${success ? 'text-green-800' : 'text-red-800'}`}>
          {success ? 'Payment Successful' : 'Payment Issue Detected'}
        </AlertTitle>
      </div>
      <AlertDescription className="mt-2 text-gray-700">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default PaymentStatusMessage;
