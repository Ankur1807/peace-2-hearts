
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { getPackageName } from '@/utils/consultation/packageUtils';

type OrderSummaryProps = {
  consultationType: string;
  totalPrice: number;
  selectedServices?: string[];
  pricing?: Map<string, number>;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  consultationType, 
  totalPrice, 
  selectedServices = [],
  pricing
}) => {
  // For holistic packages
  const packageName = selectedServices.length > 0 ? getPackageName(selectedServices) : null;
  
  // Get the appropriate package ID if it's a package
  const packageId = packageName === "Divorce Prevention Package" 
    ? 'divorce-prevention' 
    : packageName === "Pre-Marriage Clarity Package" ? 'pre-marriage-clarity' : null;
  
  // Get package price from pricing map if available (or fall back to totalPrice)
  const displayPrice = packageId && pricing && pricing.has(packageId)
    ? pricing.get(packageId)!
    : totalPrice;
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = packageName || 
                          (selectedServices.length > 0 ? getConsultationTypeLabel(selectedServices[0]) : 'Consultation');

  console.log(`OrderSummary: packageName=${packageName}, packageId=${packageId}, displayPrice=${displayPrice}, totalPrice=${totalPrice}`);

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-800">{consultationLabel}</span>
            <span className="font-medium">
              {displayPrice > 0 ? formatPrice(displayPrice) : "Price not available"}
            </span>
          </div>
          <div className="text-sm text-gray-600">60-minute consultation</div>
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{displayPrice > 0 ? formatPrice(displayPrice) : "Price not available"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
