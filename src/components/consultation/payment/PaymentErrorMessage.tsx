
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PaymentErrorMessageProps {
  message: string;
  details?: string;
  paymentId?: string;
  orderId?: string;
}

const PaymentErrorMessage: React.FC<PaymentErrorMessageProps> = ({ 
  message, 
  details,
  paymentId,
  orderId
}) => {
  return (
    <div className="flex items-start p-4 border border-red-200 rounded-md bg-red-50 text-red-700 mt-3 space-y-2">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-sm font-medium">{message}</p>
        {details && (
          <p className="text-xs text-red-600/80">{details}</p>
        )}
        {paymentId && (
          <p className="text-xs font-medium mt-2">Payment ID: {paymentId}</p>
        )}
        {orderId && (
          <p className="text-xs font-medium">Order ID: {orderId}</p>
        )}
        <div className="text-xs text-gray-500 mt-2">
          <p>If your payment was already debited but booking wasn't confirmed:</p>
          <ol className="list-decimal list-inside mt-1 ml-1 space-y-1">
            <li>Check your email for a payment confirmation from Razorpay</li>
            <li>Note your payment details above</li>
            <li>Contact our support with these details</li>
            <li>We'll verify your payment manually and confirm your booking</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorMessage;
