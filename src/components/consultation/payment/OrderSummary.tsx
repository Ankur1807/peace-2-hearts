
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
  
  // Determine the price to display - priority: test service > package price > single service price > total price
  let displayPrice = totalPrice;
  
  // Handle test service price specifically - always set to 11 if test service is selected
  if (isTestService) {
    displayPrice = 11; // Fixed price for test service
    console.log('Using hardcoded test service price: 11');
  } else if (packageId && pricing && pricing.has(packageId)) {
    displayPrice = pricing.get(packageId)!;
    console.log('Using package price:', displayPrice);
  } else if (singleServicePrice !== null) {
    displayPrice = singleServicePrice;
    console.log('Using single service price:', displayPrice);
  }
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = isTestService ? 'Test Service' : 
                          packageName || 
                          (selectedServices.length > 0 ? getConsultationTypeLabel(selectedServices[0]) : 'Consultation');

  // Log for debugging
  console.log(`OrderSummary: packageName=${packageName}, packageId=${packageId}, singleServiceId=${singleServiceId}, displayPrice=${displayPrice}, totalPrice=${totalPrice}`);
  console.log(`isTestService=${isTestService}, selectedServices=${selectedServices.join(',')}`);
  if (pricing) {
    console.log('Pricing map:', Object.fromEntries(pricing));
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
          <div className="text-sm text-gray-600">60-minute consultation</div>
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
