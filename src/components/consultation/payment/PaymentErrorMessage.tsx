
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PaymentErrorMessageProps {
  message: string;
  details?: string;
}

const PaymentErrorMessage: React.FC<PaymentErrorMessageProps> = ({ message, details }) => {
  return (
    <div className="flex items-start p-4 border border-red-200 rounded-md bg-red-50 text-red-700 mt-3 space-y-2">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{message}</p>
        {details && (
          <p className="text-xs text-red-600/80">{details}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          If this issue persists, please contact our support team for assistance.
        </p>
      </div>
    </div>
  );
};

export default PaymentErrorMessage;
