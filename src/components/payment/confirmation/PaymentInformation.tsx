
import React from 'react';

interface PaymentInformationProps {
  paymentId: string;
  orderId?: string;
  amount: number;
  referenceId: string;
}

const PaymentInformation = ({ paymentId, orderId, amount, referenceId }: PaymentInformationProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold font-lora">Payment Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-gray-500 text-sm">Payment ID</p>
          <p className="font-medium">{paymentId}</p>
        </div>
        {orderId && (
          <div>
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="font-medium">{orderId}</p>
          </div>
        )}
        {amount > 0 && (
          <div>
            <p className="text-gray-500 text-sm">Amount Paid</p>
            <p className="font-medium">₹{amount}</p>
          </div>
        )}
        {referenceId && (
          <div>
            <p className="text-gray-500 text-sm">Reference ID</p>
            <p className="font-medium">{referenceId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInformation;
