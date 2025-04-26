
import React from 'react';
import { Shield } from 'lucide-react';
import razorpayLogo from '@/assets/razorpay-logo.svg';

const RazorpayCard = () => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex flex-col items-center md:items-start md:flex-row md:gap-4">
        <div className="mb-3 md:mb-0">
          <img 
            src={razorpayLogo} 
            alt="Razorpay" 
            className="h-8"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div>
          <p className="font-medium text-center md:text-left mb-1">Secure Payment</p>
          <p className="text-sm text-gray-500 text-center md:text-left">Your payment information is securely processed by Razorpay</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-green-600">
        <Shield className="h-4 w-4" />
        <span className="text-xs">256-bit SSL Secured</span>
      </div>
    </div>
  );
};

export default RazorpayCard;
