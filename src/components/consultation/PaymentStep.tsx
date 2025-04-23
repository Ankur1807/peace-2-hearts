
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { formatPrice } from '@/utils/pricing/priceFormatter';
import Script from '@/components/Script';
import { loadRazorpayScript, isRazorpayAvailable } from '@/utils/payment/razorpayService';

type PaymentStepProps = {
  consultationType: string;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  totalPrice: number;
  selectedServices?: string[];
};

const PaymentStep = ({
  consultationType,
  onNextStep,
  onPrevStep,
  onSubmit,
  isProcessing,
  totalPrice,
  selectedServices = []
}: PaymentStepProps) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Razorpay script
  useEffect(() => {
    const checkAndLoadRazorpay = async () => {
      try {
        // Check if already loaded
        if (isRazorpayAvailable()) {
          console.log("Razorpay already available in window");
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
    console.log(`PaymentStep rendered with price: ${totalPrice}`);
  }, [totalPrice]);

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
      
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{consultationType.includes(',') ? 'Multiple Services' : getConsultationTypeLabel(consultationType)}</span>
              <span className="font-medium">{totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}</span>
            </div>
            <div className="text-sm text-gray-600">60-minute consultation</div>
          </div>
        </div>
        
        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{totalPrice > 0 ? formatPrice(totalPrice) : "Price not available"}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{' '}
            <Link to="/terms" target="_blank" className="text-peacefulBlue hover:underline">
              Terms of Service
            </Link>
            ,{' '}
            <Link to="/privacy-policy" target="_blank" className="text-peacefulBlue hover:underline">
              Privacy Policy
            </Link>
            ,{' '}
            <Link to="/cancellation-refund" target="_blank" className="text-peacefulBlue hover:underline">
              Cancellation & Refund Policy
            </Link>
            , and{' '}
            <Link to="/shipping-delivery" target="_blank" className="text-peacefulBlue hover:underline">
              Shipping & Delivery Policy
            </Link>
          </label>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <Shield className="h-5 w-5 text-gray-500 mr-3" />
          <p className="text-sm text-gray-600">
            All payment information is encrypted and secure. Your card details are never stored on our servers.
          </p>
        </div>
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={isProcessing || !acceptTerms || !razorpayLoaded || totalPrice <= 0}
        >
          {!razorpayLoaded ? "Loading Payment..." : 
           isProcessing ? "Processing..." : 
           totalPrice <= 0 ? "Price Not Available" : 
           `Pay ${formatPrice(totalPrice)}`}
        </Button>
      </div>
      
      {!razorpayLoaded && !loadError && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Payment gateway is loading. Please wait...
        </div>
      )}
      
      {totalPrice <= 0 && (
        <div className="text-center text-amber-600 text-sm mt-2">
          Unable to calculate price. Please try selecting your services again or contact support.
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
