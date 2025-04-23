
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
  // Check if we have the test service selected
  const isTestService = selectedServices.includes('test-service');
  
  // For holistic packages
  const packageName = selectedServices.length > 0 && !isTestService ? getPackageName(selectedServices) : null;
  
  // Get the appropriate package ID if it's a package
  const packageId = packageName === "Divorce Prevention Package" 
    ? 'divorce-prevention' 
    : packageName === "Pre-Marriage Clarity Package" ? 'pre-marriage-clarity' : null;
  
  // Get service price if it's a single service (not a package)
  const singleServiceId = selectedServices.length === 1 ? selectedServices[0] : null;
  const singleServicePrice = singleServiceId && pricing && pricing.has(singleServiceId) 
    ? pricing.get(singleServiceId) 
    : null;
  
  // Determine the price to display based on priority:
  // 1. Direct service price from pricing map (including test service)
  // 2. Package price from pricing map
  // 3. Total price (fallback)
  let displayPrice = totalPrice;
  
  if (singleServiceId && pricing && pricing.has(singleServiceId)) {
    displayPrice = pricing.get(singleServiceId)!;
    console.log(`OrderSummary: Using price for ${singleServiceId}: ${displayPrice}`);
  } else if (packageId && pricing && pricing.has(packageId)) {
    displayPrice = pricing.get(packageId)!;
    console.log('OrderSummary: Using package price:', displayPrice);
  }
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = isTestService ? 'Test Service' : 
                          packageName || 
                          (selectedServices.length > 0 ? getConsultationTypeLabel(selectedServices[0]) : 'Consultation');

  // Log for debugging
  console.log(`OrderSummary: packageName=${packageName}, packageId=${packageId}, singleServiceId=${singleServiceId}, displayPrice=${displayPrice}, totalPrice=${totalPrice}`);
  console.log(`OrderSummary: isTestService=${isTestService}, selectedServices=${selectedServices.join(',')}`);
  if (pricing) {
    console.log('OrderSummary: Pricing map:', Object.fromEntries(pricing));
  }
  
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
              {displayPrice > 0 ? formatPrice(displayPrice) : "Price not available"}
            </span>
          </div>
          {!isTestService && (
            <div className="text-sm text-gray-600">60-minute consultation</div>
          )}
          {isTestService && (
            <div className="text-sm text-gray-600">Test service for payment system validation</div>
          )}
        </div>
      </div>
      
      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className={displayPrice > 0 ? "text-lg" : "text-lg text-peacefulBlue"}>
            {displayPrice > 0 ? formatPrice(displayPrice) : "Price unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
