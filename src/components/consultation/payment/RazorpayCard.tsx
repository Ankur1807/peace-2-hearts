
import React from 'react';
import { Card } from '@/components/ui/card';
import { Lock, CreditCard } from 'lucide-react';

const RazorpayCard: React.FC = () => {
  return (
    <Card className="p-4 border border-gray-200 bg-white">
      <div className="flex items-start space-x-4">
        <div className="bg-gray-50 p-2 rounded-full">
          <CreditCard className="h-6 w-6 text-peacefulBlue" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-medium mb-2">Payment Method</h4>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img 
                  src="https://cdn.razorpay.com/static/assets/logo/razorpay-logo.svg" 
                  alt="Razorpay" 
                  className="h-6 mr-2"
                />
                <span className="text-sm text-gray-600">Online Payment</span>
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <Lock className="h-4 w-4 mr-1" />
                <span>Secure</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              You'll be redirected to a secure payment gateway to complete your transaction.
              We accept Credit/Debit cards, UPI, Net Banking, and more.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RazorpayCard;
