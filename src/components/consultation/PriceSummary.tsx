
import React from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';
import PriceAlert from './price/PriceAlert';
import PackagePriceDisplay from './price/PackagePriceDisplay';
import ServicePriceDisplay from './price/ServicePriceDisplay';

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
  if (services.length === 0) return null;

  // For holistic packages
  const packageName = services.length > 0 ? getPackageName(services) : null;
  const packageId = packageName === "Divorce Prevention Package" 
    ? 'divorce-prevention' 
    : packageName === "Pre-Marriage Clarity Package" ? 'pre-marriage-clarity' : null;

  // Get package price from pricing map if available
  const packagePrice = packageId && pricing && pricing.has(packageId) 
    ? pricing.get(packageId)! 
    : totalPrice;

  const serviceId = services.length > 0 ? services[0] : '';
  const servicePrice = serviceId && pricing && pricing.has(serviceId) 
    ? pricing.get(serviceId)!
    : totalPrice;

  // Price to display (from pricing only)
  let displayPrice = totalPrice;
  if (packageName && packagePrice > 0) displayPrice = packagePrice;
  if (!packageName && serviceId && servicePrice > 0) displayPrice = servicePrice;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price</h3>
      
      {displayPrice === 0 && <PriceAlert />}

      {packageName && displayPrice > 0 && (
        <PackagePriceDisplay 
          packageName={packageName} 
          packagePrice={packagePrice}
          currency={currency}
        />
      )}

      {!packageName && serviceId && displayPrice > 0 && (
        <ServicePriceDisplay
          serviceId={serviceId}
          servicePrice={servicePrice}
          currency={currency}
        />
      )}
    </div>
  );
};

export default React.memo(PriceSummary);
