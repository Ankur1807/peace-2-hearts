
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import Script from '@/components/Script';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';
import PaymentTerms from './PaymentTerms';
import OrderSummary from './OrderSummary';
import PaymentActions from './PaymentActions';
import RazorpayCard from './RazorpayCard';

type PaymentStepProps = {
  consultationType: string;
  selectedServices: string[];
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  totalPrice: number;
  pricing: Map<string, number>;
};

const PaymentStep: React.FC<PaymentStepProps> = ({
  consultationType,
  selectedServices,
  onNextStep,
  onPrevStep,
  onSubmit,
  isProcessing,
  totalPrice,
  pricing
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const isTestService = selectedServices.includes('test-service');
  
  // Get fixed test price or from pricing map
  const getTestServicePrice = () => {
    const mappedPrice = pricing?.get('test-service');
    console.log(`PaymentStep - test service price from mapping: ${mappedPrice}`);
    return mappedPrice !== undefined ? mappedPrice : 11;
  };
  
  // Calculate the actual price to use
  const actualPrice = isTestService ? getTestServicePrice() : totalPrice;
  
  // Load Razorpay script
  useEffect(() => {
    const checkAndLoadRazorpay = async () => {
      try {
        // Check if already loaded
        if (isRazorpayAvailable()) {
          console.log("Razorpay already loaded");
          setRazorpayLoaded(true);
          return;
        }

        // Try to load the script
        const loaded = await loadRazorpayScript();
        console.log("Razorpay script load result:", loaded);
        setRazorpayLoaded(loaded);
        
        if (!loaded) {
          setLoadError("Failed to load payment gateway. Please refresh and try again.");
        }
      } catch (err) {
        console.error("Error loading Razorpay:", err);
        setLoadError("Error initializing payment gateway. Please refresh and try again.");
        setRazorpayLoaded(false);
      }
    };

    checkAndLoadRazorpay();
  }, []);
  
  // For debugging
  useEffect(() => {
    console.log("PaymentStep - isTestService:", isTestService);
    console.log("PaymentStep - fixed test price:", getTestServicePrice());
    console.log("PaymentStep - actualPrice:", actualPrice);
    console.log("PaymentStep - totalPrice:", totalPrice);
    console.log("PaymentStep - Selected services:", selectedServices);
  }, [isTestService, totalPrice, selectedServices, pricing]);

  return (
    <div className="space-y-6">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        id="razorpay-script"
        onLoad={() => {
          console.log("Razorpay script loaded via Script component");
          setRazorpayLoaded(true);
          setLoadError(null);
        }}
      />
      
      <h2 className="text-2xl font-lora font-semibold mb-6">Payment Information</h2>
      
      {loadError && (
        <div className="flex items-center p-4 mb-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-sm text-red-600">
            {loadError}
          </p>
        </div>
      )}
      
      <OrderSummary 
        consultationType={consultationType}
        totalPrice={actualPrice}
        selectedServices={selectedServices}
        pricing={pricing}
      />
      
      <RazorpayCard />
      
      <PaymentTerms 
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />
      
      <PaymentActions 
        onPrevStep={onPrevStep}
        onSubmit={onSubmit}
        totalPrice={actualPrice}
        selectedServices={selectedServices}
        pricing={pricing}
        isProcessing={isProcessing}
        acceptTerms={acceptTerms}
        razorpayLoaded={razorpayLoaded}
      />
      
      {!razorpayLoaded && !loadError && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Payment gateway is loading. Please wait...
        </div>
      )}
      
      {actualPrice <= 0 && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Unable to calculate price. Please try selecting your services again or contact support.
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
