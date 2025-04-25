
import React from 'react';
import { Card } from '@/components/ui/card';

const RazorpayCard: React.FC = () => {
  return (
    <Card className="p-4 border border-gray-200 bg-white">
      {/* Razorpay Badge */}
      <div className="flex justify-center">
        <a 
          href="https://razorpay.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img 
            referrerPolicy="origin" 
            src="https://badges.razorpay.com/badge-light.png" 
            style={{ height: '45px', width: '113px' }} 
            alt="Razorpay | Payment Gateway | Neobank" 
          />
        </a>
      </div>
    </Card>
  );
};

export default RazorpayCard;
