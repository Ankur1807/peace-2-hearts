
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
  // Calculate the effective price to display
  const [displayPrice, setDisplayPrice] = React.useState<number>(totalPrice);
  
  React.useEffect(() => {
    let price = totalPrice;
    
    // Check if test service is selected
    const isTestService = selectedServices.includes('test-service');
    
    if (isTestService) {
      if (pricing?.has('test-service')) {
        const testPrice = pricing.get('test-service');
        if (testPrice && testPrice > 0) {
          console.log(`OrderSummary: Using test service price ${testPrice}`);
          price = testPrice;
        } else {
          console.log('OrderSummary: Test service has no valid price in pricing map, using default');
          price = 11; // Default for test service
        }
      } else {
        console.log('OrderSummary: No test service price in pricing map, using default');
        price = 11; // Default for test service
      }
    }
    // For holistic packages
    else {
      const packageName = selectedServices.length > 0 ? getPackageName(selectedServices) : null;
      const packageId = packageName === "Divorce Prevention Package" 
        ? 'divorce-prevention' 
        : packageName === "Pre-Marriage Clarity Package" ? 'pre-marriage-clarity' : null;
      
      if (packageId && pricing?.has(packageId)) {
        price = pricing.get(packageId) || price;
        console.log(`OrderSummary: Using package price ${price} for ${packageId}`);
      }
      // Single service (non-package, non-test)
      else if (selectedServices.length === 1 && pricing) {
        const serviceId = selectedServices[0];
        if (pricing.has(serviceId)) {
          price = pricing.get(serviceId) || price;
          console.log(`OrderSummary: Using price for service ${serviceId}: ${price}`);
        }
      }
    }
    
    if (price !== displayPrice) {
      console.log(`OrderSummary: Updating display price from ${displayPrice} to ${price}`);
      setDisplayPrice(price);
    }
  }, [totalPrice, selectedServices, pricing, displayPrice]);
  
  // Check if we have the test service selected
  const isTestService = selectedServices.includes('test-service');
  
  // For holistic packages
  const packageName = selectedServices.length > 0 && !isTestService ? getPackageName(selectedServices) : null;
  
  // Get the appropriate label - package name, service name, or generic label
  const consultationLabel = isTestService ? 'Test Service' : 
                          packageName || 
                          (selectedServices.length > 0 ? getConsultationTypeLabel(selectedServices[0]) : 'Consultation');

  // Log for debugging
  React.useEffect(() => {
    console.log(`OrderSummary Debug - packageName: ${packageName}`);
    console.log(`OrderSummary Debug - isTestService: ${isTestService}`);
    console.log(`OrderSummary Debug - displayPrice: ${displayPrice}`);
    console.log(`OrderSummary Debug - totalPrice: ${totalPrice}`);
    console.log(`OrderSummary Debug - selectedServices: ${selectedServices.join(',')}`);
    console.log(`OrderSummary Debug - pricing available:`, pricing ? Object.fromEntries(pricing) : 'No pricing data');
    
    // Special check for test service
    if (isTestService) {
      console.log(`OrderSummary Debug - Test service price from map: ${pricing?.get('test-service') || 'not found'}`);
    }
  }, [packageName, isTestService, displayPrice, totalPrice, selectedServices, pricing]);
  
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
              {isTestService ? formatPrice(11) : 
               displayPrice > 0 ? formatPrice(displayPrice) : "Price not available"}
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
            {isTestService ? formatPrice(11) : 
             displayPrice > 0 ? formatPrice(displayPrice) : "Price unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
