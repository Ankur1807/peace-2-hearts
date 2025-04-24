
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Script from '@/components/Script';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';
import PaymentTerms from './PaymentTerms';
import OrderSummary from './OrderSummary';
import PaymentActions from './PaymentActions';
import RazorpayCard from './RazorpayCard';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';

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
  
  // Use the hook to calculate the effective price
  const getEffectivePrice = useEffectivePrice({
    selectedServices,
    pricing,
    totalPrice
  });
  
  const effectivePrice = getEffectivePrice();
  
  // For debugging
  useEffect(() => {
    console.log("PaymentStep - Debug Information:", {
      selectedServices,
      effectivePrice,
      totalPrice,
      pricing: pricing ? Object.fromEntries(pricing) : {},
      isTestService: selectedServices.includes('test-service')
    });
  }, [selectedServices, effectivePrice, totalPrice, pricing]);

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

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Payment form submitted");
    e.preventDefault();
    onSubmit(e);
  };

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
        totalPrice={totalPrice}
        selectedServices={selectedServices}
        pricing={pricing}
      />
      
      <RazorpayCard />
      
      <PaymentTerms 
        acceptTerms={acceptTerms}
        setAcceptTerms={setAcceptTerms}
      />
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isProcessing || !acceptTerms || !razorpayLoaded || effectivePrice <= 0}
          onClick={handleSubmit}
        >
          {!razorpayLoaded ? "Loading Payment..." : 
           isProcessing ? "Processing..." : 
           effectivePrice <= 0 ? "Price Not Available" : 
           `Pay ₹${effectivePrice}`}
        </Button>
      </div>
      
      {!razorpayLoaded && !loadError && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Payment gateway is loading. Please wait...
        </div>
      )}
      
      {effectivePrice <= 0 && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Unable to calculate price. Please try selecting your services again or contact support.
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
