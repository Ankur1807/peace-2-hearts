
import React from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';
import PriceAlert from './price/PriceAlert';
import PackagePriceDisplay from './price/PackagePriceDisplay';
import ServicePriceDisplay from './price/ServicePriceDisplay';
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';

interface PriceSummaryProps {
  services: string[];
  pricing?: Map<string, number>;
  totalPrice: number;
  currency?: string;
}

// Map from package names to Supabase service IDs
const packageNameToSupabaseId: Record<string, string> = {
  "Divorce Prevention Package": 'P2H-H-divorce-prevention-package',
  "Pre-Marriage Clarity Package": 'P2H-H-pre-marriage-clarity-solutions'
};

const PriceSummary: React.FC<PriceSummaryProps> = ({ 
  services, 
  pricing,
  totalPrice,
  currency = 'INR'
}) => {
  if (services.length === 0) return null;

  // For holistic packages
  const packageName = services.length > 0 ? getPackageName(services) : null;
  const packageId = packageName ? packageNameToSupabaseId[packageName] : null;

  // Get package price from pricing map if available, otherwise use getFallbackPrice
  let packagePrice = 0;
  if (packageName && packageId) {
    // First try pricing map
    if (pricing && pricing.has(packageId)) {
      packagePrice = pricing.get(packageId)!;
    } else {
      // If not in pricing map, use getFallbackPrice
      const fallbackPrice = getFallbackPrice(packageId);
      packagePrice = fallbackPrice !== undefined ? fallbackPrice : 0;
    }
  }

  // For individual services
  const serviceId = services.length > 0 ? services[0] : '';
  let servicePrice = 0;
  
  if (serviceId && !packageName) {
    // First try pricing map
    if (pricing && pricing.has(serviceId)) {
      servicePrice = pricing.get(serviceId)!;
    } else {
      // If not in pricing map, use getFallbackPrice for the service
      const fallbackPrice = getFallbackPrice(serviceId);
      servicePrice = fallbackPrice !== undefined ? fallbackPrice : 0;
    }
  }

  // Price to display (from pricing or fallback)
  let displayPrice = 0;
  if (packageName && packagePrice > 0) {
    displayPrice = packagePrice;
  } else if (!packageName && serviceId && servicePrice > 0) {
    displayPrice = servicePrice;
  } else {
    displayPrice = totalPrice;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium text-lg mb-3">Price</h3>
      
      {displayPrice === 0 && <PriceAlert />}

      {packageName && packageId && displayPrice > 0 && (
        <PackagePriceDisplay 
          packageName={packageName} 
          serviceId={packageId}
          currency={currency}
        />
      )}

      {!packageName && serviceId && displayPrice > 0 && (
        <ServicePriceDisplay
          serviceId={serviceId}
          currency={currency}
        />
      )}
    </div>
  );
};

export default React.memo(PriceSummary);
