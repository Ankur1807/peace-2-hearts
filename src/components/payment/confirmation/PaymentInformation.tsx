
import React from 'react';

interface PaymentInformationProps {
  paymentId: string;
  orderId: string | null;
  amount: number;
  referenceId: string | null;
}

const PaymentInformation = ({ 
  paymentId, 
  orderId, 
  amount, 
  referenceId 
}: PaymentInformationProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold font-lora">Payment Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-gray-500 text-sm">Payment ID</p>
          <p className="font-medium">{paymentId}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Order ID</p>
          <p className="font-medium">{orderId || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Amount Paid</p>
          <p className="font-medium">₹{amount}</p>
        </div>
        {referenceId && (
          <div>
            <p className="text-gray-500 text-sm">Reference ID</p>
            <p className="font-medium">{referenceId}</p>
          </div>
        )}
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>Please save these details for your reference. You will also receive a confirmation email shortly.</p>
      </div>
    </div>
  );
};

export default PaymentInformation;
