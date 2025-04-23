
import React from 'react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { User } from 'lucide-react';

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
  // Get price from pricing map if available, or fallback to totalPrice
  const getEffectivePrice = () => {
    if (selectedServices.includes('test-service') && pricing && pricing.has('test-service')) {
      const price = pricing.get('test-service');
      console.log(`OrderSummary - Using test service price: ${price}`);
      return price as number;
    }
    
    if (selectedServices.length === 1) {
      const serviceId = selectedServices[0];
      if (pricing && pricing.has(serviceId)) {
        const price = pricing.get(serviceId);
        console.log(`OrderSummary - Using service price for ${serviceId}: ${price}`);
        return price as number;
      }
    }
    
    console.log(`OrderSummary - Using totalPrice: ${totalPrice}`);
    return totalPrice;
  };
  
  const effectivePrice = getEffectivePrice();

  // For holistic packages
  const packageName = selectedServices.length > 0 
    ? getPackageName(selectedServices) 
    : null;
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = selectedServices.includes('test-service')
    ? 'Test Service' 
    : packageName || (selectedServices.length > 0 
        ? getConsultationTypeLabel(selectedServices[0]) 
        : 'Consultation');

  // Debug logs
  React.useEffect(() => {
    console.log(`OrderSummary Debug - selected services: ${selectedServices.join(',')}`);
    console.log(`OrderSummary Debug - pricing map:`, pricing ? Object.fromEntries(pricing) : "N/A");
    console.log(`OrderSummary Debug - totalPrice: ${totalPrice}`);
    console.log(`OrderSummary Debug - effectivePrice: ${effectivePrice}`);
  }, [effectivePrice, totalPrice, selectedServices, pricing]);
  
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-peacefulBlue" />
          <h3 className="font-semibold">Consultation Summary</h3>
        </div>
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
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className={effectivePrice > 0 ? "text-lg" : "text-lg text-peacefulBlue"}>
            {effectivePrice > 0 
              ? formatPrice(effectivePrice) 
              : "Price unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
