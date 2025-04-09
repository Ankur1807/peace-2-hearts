
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/fetchPricing';

type OrderSummaryProps = {
  consultationType: string;
  totalPrice: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ consultationType, totalPrice }) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>{consultationType.includes(',') ? 'Multiple Services' : getConsultationTypeLabel(consultationType)}</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="text-sm text-gray-600">60-minute consultation</div>
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
