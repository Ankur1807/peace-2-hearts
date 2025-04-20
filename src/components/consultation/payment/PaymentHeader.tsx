
import React from 'react';

const PaymentHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-semibold mb-2 text-gray-800">
        Complete Your Payment
      </h2>
      <p className="text-gray-600">
        You're almost done! Please review your order and complete the payment.
      </p>
    </div>
  );
};

export default PaymentHeader;
