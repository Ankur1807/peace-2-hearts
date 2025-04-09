
import React from 'react';
import { formatPrice } from '@/utils/pricing/fetchPricing';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';
import { AlertCircle } from 'lucide-react';

interface PriceSummaryProps {
  services: string[];
  pricing: Map<string, number>;
  totalPrice: number;
  currency?: string;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  services, 
  pricing, 
  totalPrice,
  currency = 'INR'
}) => {
  // Helper function to check if selected services match a package
  const getPackageName = () => {
    // Divorce Prevention Package services
    const divorcePrevention = [
      'couples-counselling',
      'mental-health-counselling',
      'mediation',
      'general-legal'
    ];
    
    // Pre-Marriage Clarity Package services
    const preMarriageClarity = [
      'pre-marriage-legal',
      'premarital-counselling',
      'mental-health-counselling'
    ];

    // Check if selected services match a package
    if (services.length === divorcePrevention.length && 
        divorcePrevention.every(s => services.includes(s))) {
      return "Divorce Prevention Package";
    }
    
    if (services.length === preMarriageClarity.length && 
        preMarriageClarity.every(s => services.includes(s))) {
      return "Pre-Marriage Clarity Package";
    }
    
    return null;
  };

  // Check if we have valid pricing data
  const hasPricing = services.some(service => pricing.has(service) && pricing.get(service)! > 0);
  const packageName = getPackageName();
  const hasPackagePrice = packageName && ((packageName === "Divorce Prevention Package" && pricing.has('divorce-prevention')) || 
                           (packageName === "Pre-Marriage Clarity Package" && pricing.has('pre-marriage-clarity')));

  if (services.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price Summary</h3>
      
      {!hasPricing && !hasPackagePrice && totalPrice === 0 && (
        <div className="mb-3 flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-600">
            Price information is currently unavailable from our database.
          </p>
        </div>
      )}
      
      {packageName ? (
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="font-medium">{packageName}</span>
          <span className="font-semibold">
            {hasPackagePrice && totalPrice > 0 
              ? formatPrice(totalPrice, currency) 
              : "Price not available"}
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {services.map(serviceId => (
            <div key={serviceId} className="flex justify-between items-center py-1 border-b border-gray-200">
              <span>{getConsultationTypeLabel(serviceId)}</span>
              <span>
                {pricing.has(serviceId) && pricing.get(serviceId)! > 0 
                  ? formatPrice(pricing.get(serviceId), currency)
                  : "Price not available"}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center pt-3 font-semibold">
        <span>Total</span>
        <span className="text-lg">
          {totalPrice > 0 ? formatPrice(totalPrice, currency) : "Price not available"}
        </span>
      </div>
    </div>
  );
};

export default PriceSummary;
