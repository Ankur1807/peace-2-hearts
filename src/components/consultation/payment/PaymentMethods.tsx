
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  // For now, only Razorpay is supported, so we're showing a simplified payment method selection
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
      
      <div className="border p-4 rounded-md bg-white flex items-center space-x-3">
        <div className="flex-shrink-0">
          <CreditCard className="h-5 w-5 text-peacefulBlue" />
        </div>
        <div className="flex-grow">
          <Label className="font-medium">Card / UPI / Netbanking</Label>
          <p className="text-sm text-gray-500">Pay securely via Razorpay</p>
        </div>
        <div className="flex-shrink-0">
          <div className="h-4 w-4 rounded-full border-2 border-peacefulBlue flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-peacefulBlue"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
