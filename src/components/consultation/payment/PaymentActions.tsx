
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/pricing/fetchPricing';

interface PaymentActionsProps {
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  totalPrice: number;
  selectedServices?: string[];
  pricing?: Map<string, number>;
  isProcessing: boolean;
  acceptTerms: boolean;
  razorpayLoaded: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  onPrevStep,
  onSubmit,
  totalPrice,
  selectedServices = [],
  pricing,
  isProcessing,
  acceptTerms,
  razorpayLoaded
}) => {
  // Get the effective price for this service
  const [effectivePrice, setEffectivePrice] = React.useState<number>(totalPrice);
  
  // Calculate the actual price to display and use for payment
  React.useEffect(() => {
    let price = totalPrice;
    
    // Special handling for test service
    const isTestService = selectedServices.includes('test-service');
    
    if (isTestService) {
      if (pricing?.has('test-service')) {
        const testPrice = pricing.get('test-service');
        if (testPrice && testPrice > 0) {
          console.log(`PaymentActions: Using price ${testPrice} for test-service from pricing map`);
          price = testPrice;
        } else {
          console.log('PaymentActions: Test service has no valid price in pricing map, using default');
          price = 11; // Default for test service
        }
      } else {
        console.log('PaymentActions: No test service price in pricing map, using default');
        price = 11; // Default for test service
      }
    }
    // For single non-test service 
    else if (selectedServices.length === 1 && pricing) {
      const serviceId = selectedServices[0];
      
      if (pricing.has(serviceId)) {
        price = pricing.get(serviceId) || price;
        console.log(`PaymentActions: Using price ${price} for service ${serviceId}`);
      }
    }
    
    if (price !== effectivePrice) {
      console.log(`PaymentActions: Updating effective price from ${effectivePrice} to ${price}`);
      setEffectivePrice(price);
    }
  }, [totalPrice, selectedServices, pricing, effectivePrice]);
  
  // Extra debug logging to make sure we have the right data
  React.useEffect(() => {
    console.log(`PaymentActions Debug - effectivePrice: ${effectivePrice}`);
    console.log(`PaymentActions Debug - totalPrice: ${totalPrice}`);
    console.log(`PaymentActions Debug - selectedServices: ${selectedServices.join(',')}`);
    console.log(`PaymentActions Debug - pricing available:`, pricing ? Object.fromEntries(pricing) : 'No pricing data');
    
    // Special check for test service
    if (selectedServices.includes('test-service')) {
      console.log(`PaymentActions Debug - Test service price from map: ${pricing?.get('test-service') || 'not found'}`);
    }
    
  }, [effectivePrice, totalPrice, selectedServices, pricing]);
  
  // Check if we're dealing with test service
  const isTestService = selectedServices.includes('test-service');
  const displayPrice = isTestService ? 11 : effectivePrice;
  
  return (
    <div className="pt-6 flex justify-between">
      <Button type="button" variant="outline" onClick={onPrevStep}>
        Back
      </Button>
      <Button 
        type="submit" 
        className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        disabled={isProcessing || !acceptTerms || !razorpayLoaded || (effectivePrice <= 0 && !isTestService)}
        onClick={(e) => {
          console.log(`Payment button clicked with effectivePrice: ${effectivePrice}, isTestService: ${isTestService}, final price: ${isTestService ? 11 : effectivePrice}`);
          onSubmit(e);
        }}
      >
        {!razorpayLoaded ? "Loading Payment..." : 
         isProcessing ? "Processing..." : 
         effectivePrice <= 0 && !isTestService ? "Price Not Available" : 
         `Pay ${formatPrice(isTestService ? 11 : effectivePrice)}`}
      </Button>
    </div>
  );
};

export default PaymentActions;
