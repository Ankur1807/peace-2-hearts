
import React from 'react';
import { formatPrice } from '@/utils/pricing';

interface OrderAmountProps {
  effectivePrice: number;
  consultationLabel: string;
}

const OrderAmount: React.FC<OrderAmountProps> = ({ effectivePrice, consultationLabel }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-800">{consultationLabel}</span>
      <span className="font-medium">
        {effectivePrice > 0 
          ? formatPrice(effectivePrice) 
          : "Price not available"}
      </span>
    </div>
  );
};

export default OrderAmount;
