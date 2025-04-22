
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PaymentErrorMessageProps {
  message: string;
}

const PaymentErrorMessage: React.FC<PaymentErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center p-3 border border-red-200 rounded-md bg-red-50 text-red-700 mt-2">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default PaymentErrorMessage;
