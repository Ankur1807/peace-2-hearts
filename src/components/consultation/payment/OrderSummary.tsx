
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { getPackageName } from '@/utils/consultation/packageUtils';

type OrderSummaryProps = {
  consultationType: string;
  totalPrice: number;
  selectedServices?: string[];
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ consultationType, totalPrice, selectedServices = [] }) => {
  // Check if it's a package
  const packageName = selectedServices.length > 0 ? getPackageName(selectedServices) : null;
  
  // Get the appropriate label
  const consultationLabel = packageName || (consultationType.includes(',') 
    ? 'Multiple Services' 
    : getConsultationTypeLabel(consultationType));

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-800">{consultationLabel}</span>
            <span className="font-medium">
              {totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}
            </span>
          </div>
          <div className="text-sm text-gray-600">60-minute consultation</div>
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
