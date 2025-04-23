
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
  // Check if test service is selected - this should be the first thing we do
  const isTestService = selectedServices.includes('test-service');
  const TEST_SERVICE_PRICE = 11; // Fixed price for test service
  
  // Calculate effective price - hardcode for test service
  const effectivePrice = isTestService 
    ? TEST_SERVICE_PRICE 
    : totalPrice;

  // For holistic packages
  const packageName = !isTestService && selectedServices.length > 0 
    ? getPackageName(selectedServices) 
    : null;
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = isTestService 
    ? 'Test Service' 
    : packageName || (selectedServices.length > 0 
        ? getConsultationTypeLabel(selectedServices[0]) 
        : 'Consultation');

  // Debug logs
  React.useEffect(() => {
    console.log(`OrderSummary Debug - isTestService: ${isTestService}`);
    console.log(`OrderSummary Debug - fixed test price: ${TEST_SERVICE_PRICE}`);
    console.log(`OrderSummary Debug - effectivePrice: ${effectivePrice}`);
    console.log(`OrderSummary Debug - totalPrice: ${totalPrice}`);
    console.log(`OrderSummary Debug - selectedServices: ${selectedServices.join(',')}`);
  }, [isTestService, effectivePrice, totalPrice, selectedServices]);
  
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
              {isTestService 
                ? formatPrice(TEST_SERVICE_PRICE) 
                : effectivePrice > 0 
                  ? formatPrice(effectivePrice) 
                  : "Price not available"}
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
          <span className={effectivePrice > 0 ? "text-lg" : "text-lg text-peacefulBlue"}>
            {isTestService 
              ? formatPrice(TEST_SERVICE_PRICE) 
              : effectivePrice > 0 
                ? formatPrice(effectivePrice) 
                : "Price unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
