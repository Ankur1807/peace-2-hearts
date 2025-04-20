
import React from 'react';

interface PaymentErrorMessageProps {
  message: string;
}

const PaymentErrorMessage: React.FC<PaymentErrorMessageProps> = ({ message }) => {
  return (
    <div className="text-center text-amber-600 text-sm mt-2">
      {message}
    </div>
  );
};

export default PaymentErrorMessage;
