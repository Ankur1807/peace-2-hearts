
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing';
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
  // Get the appropriate label - package name, service name, or generic label
  const packageName = selectedServices.length > 0 
    ? getPackageName(selectedServices) 
    : null;
  
  const consultationLabel = packageName || 
    (selectedServices.length > 0 
      ? getConsultationTypeLabel(selectedServices[0]) 
      : 'Consultation');

  // Get price from pricing map
  const getEffectivePrice = () => {
    // Check for package pricing first
    if (packageName) {
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : 'pre-marriage-clarity';
      
      if (pricing && pricing.has(packageId)) {
        return pricing.get(packageId)!;
      }
    }

    // Fallback to individual service pricing
    if (selectedServices.length === 1) {
      const serviceId = selectedServices[0];
      if (pricing && pricing.has(serviceId)) {
        return pricing.get(serviceId)!;
      }
    }

    return totalPrice;
  };
  
  const effectivePrice = getEffectivePrice();

  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-800">{consultationLabel}</span>
            <span className="font-medium">
              {effectivePrice > 0 
                ? formatPrice(effectivePrice) 
                : "Price not available"}
            </span>
          </div>
          {!selectedServices.includes('test-service') && (
            <div className="text-sm text-gray-600">60-minute consultation</div>
          )}
          {selectedServices.includes('test-service') && (
            <div className="text-sm text-gray-600">Test service for payment system validation</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
