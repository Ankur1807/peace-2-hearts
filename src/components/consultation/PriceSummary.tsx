
import React from 'react';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { AlertCircle } from 'lucide-react';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';

interface PriceSummaryProps {
  services: string[];
  pricing?: Map<string, number>;
  totalPrice: number;
  currency?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  services, 
  pricing,
  totalPrice,
  currency = 'INR'
}) => {
  // Check if test service is selected
  const isTestService = services.includes('test-service');
  const TEST_SERVICE_PRICE = 11; // Fixed price for test service
  
  // For holistic packages
  const packageName = !isTestService && services.length > 0 ? getPackageName(services) : null;
  const packageId = packageName === "Divorce Prevention Package" 
    ? 'divorce-prevention' 
    : packageName === "Pre-Marriage Clarity Package" ? 'pre-marriage-clarity' : null;

  // Get package price from pricing map if available
  const packagePrice = packageId && pricing && pricing.has(packageId) 
    ? pricing.get(packageId)! 
    : totalPrice;

  const serviceId = services.length > 0 ? services[0] : '';
  const servicePrice = serviceId && !isTestService && pricing && pricing.has(serviceId) 
    ? pricing.get(serviceId)! 
    : totalPrice;
  const serviceName = serviceId ? getConsultationTypeLabel(serviceId) : '';

  // Calculate display price based on whether it's a test service
  const displayPrice = isTestService ? TEST_SERVICE_PRICE : (packageName ? packagePrice : servicePrice);

  console.log(`PriceSummary rendered with services: ${services.join(', ')}, isTestService: ${isTestService}, displayPrice: ${displayPrice}`);
  
  if (services.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price Summary</h3>
      
      {!isTestService && totalPrice === 0 && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-600">
            Price information is currently unavailable.
          </p>
        </div>
      )}
      
      {isTestService && (
        <div className="mb-3 py-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>Test Service</span>
            <span>{formatPrice(TEST_SERVICE_PRICE, currency)}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Test payment validation service
          </div>
        </div>
      )}
      
      {packageName && !isTestService && (
        <div className="mb-3 py-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>{packageName}</span>
            <span>{formatPrice(packagePrice, currency)}</span>
          </div>
        </div>
      )}
      
      {!packageName && !isTestService && totalPrice > 0 && services.length > 0 && (
        <div className="mb-3 py-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>{serviceName || "Consultation"}</span>
            <span>{formatPrice(servicePrice, currency)}</span>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 font-semibold">
        <span>Total</span>
        <span className="text-lg">
          {isTestService 
            ? formatPrice(TEST_SERVICE_PRICE, currency) 
            : totalPrice > 0 
              ? formatPrice(displayPrice, currency) 
              : "Price not available"}
        </span>
      </div>
    </div>
  );
};

export default React.memo(PriceSummary);
