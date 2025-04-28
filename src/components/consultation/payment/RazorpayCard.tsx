
import React from 'react';
import { Shield } from 'lucide-react';

const RazorpayCard = () => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex flex-col items-center space-y-3">
        <div className="text-center">
          <p className="font-medium mb-1">Secure Payment</p>
          <p className="text-sm text-gray-500">Your payment information is securely processed by Razorpay</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center gap-1 text-green-600">
            <Shield className="h-4 w-4" />
            <span className="text-xs">256-bit SSL Secured</span>
          </div>
          
          <a 
            href="https://razorpay.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://badges.razorpay.com/badge-dark.png"
              alt="Razorpay | Payment Gateway"
              className="h-[30px] w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCard;
