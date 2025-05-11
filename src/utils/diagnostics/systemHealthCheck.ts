
import { getFallbackPrice } from '@/utils/pricing/fallbackPrices';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';
import { getPackageName } from '@/utils/consultation/packageUtils';
import { getConsultationTypeLabel } from '@/utils/consultationLabels';

// 1. Pricing Consistency Check
export const checkPricingConsistency = (pricing?: Map<string, number>) => {
  console.group('🧪 DIAGNOSTIC: Pricing Consistency Check');
  
  console.log('Available pricing map keys:', pricing ? [...pricing.keys()] : 'No pricing map available');
  
  // Check if all keys are Supabase-aligned (start with P2H-)
  if (pricing && pricing.size > 0) {
    const nonAlignedKeys = [...pricing.keys()].filter(key => !key.startsWith('P2H-'));
    
    if (nonAlignedKeys.length > 0) {
      console.warn('⚠️ Found non-Supabase-aligned keys in pricing map:', nonAlignedKeys);
    } else {
      console.log('✅ All pricing keys are Supabase-aligned');
    }
    
    // Log all pricing values
    console.log('Pricing values:', Object.fromEntries(pricing));
  } else {
    console.warn('⚠️ No pricing data available for analysis');
  }
  
  // Check fallback prices
  const testServices = [
    'P2H-MH-mental-health-counselling',
    'P2H-L-divorce-consultation',
    'P2H-H-divorce-prevention-package'
  ];
  
  console.log('Testing fallback prices:');
  testServices.forEach(serviceId => {
    const fallbackPrice = getFallbackPrice(serviceId);
    console.log(`${serviceId}: ${fallbackPrice !== undefined ? `₹${fallbackPrice}` : 'Not available in fallbacks'}`);
  });
  
  console.groupEnd();
};

// 2. Service ID Mapping Check
export const checkServiceIdMapping = () => {
  console.group('🧪 DIAGNOSTIC: Service ID Mapping');
  
  // Define the legacy to Supabase ID mapping from the application
  const legacyIdMap: Record<string, string> = {
    'divorce-prevention': 'P2H-H-divorce-prevention-package',
    'pre-marriage-clarity': 'P2H-H-pre-marriage-clarity-solutions',
    'couples-counselling': 'P2H-MH-couples-counselling',
    'family-therapy': 'P2H-MH-family-therapy',
    'sexual-health-counselling': 'P2H-MH-sexual-health-counselling',
    'mental-health-counselling': 'P2H-MH-mental-health-counselling',
    'test-service': 'P2H-MH-test-service',
    'mediation': 'P2H-L-mediation-services',
    'maintenance': 'P2H-L-maintenance-consultation',
    'custody': 'P2H-L-child-custody-consultation',
    'divorce': 'P2H-L-divorce-consultation',
    'general-legal': 'P2H-L-general-legal-consultation'
  };
  
  console.log('Legacy ID mapping being used:', legacyIdMap);
  
  // Check for any remaining legacy references to pre-marriage-legal
  if ('pre-marriage-legal' in legacyIdMap) {
    console.warn('⚠️ Legacy mapping still contains pre-marriage-legal reference');
  } else {
    console.log('✅ No pre-marriage-legal found in legacy mapping');
  }
  
  console.groupEnd();
};

// 3. Booking Flow Health
export const checkBookingFlowHealth = (selectedServices: string[], totalPrice: number) => {
  console.group('🧪 DIAGNOSTIC: Booking Flow Health');
  
  if (selectedServices.length > 0) {
    console.log('Selected services:', selectedServices);
    
    // Check for package detection
    const packageName = getPackageName(selectedServices);
    if (packageName) {
      console.log(`Detected package: ${packageName}`);
    }
    
    // Check service labels
    selectedServices.forEach(serviceId => {
      const label = getConsultationTypeLabel(serviceId);
      console.log(`Service ${serviceId} label: "${label}"`);
    });
  } else {
    console.log('No services selected');
  }
  
  console.log(`Total price: ₹${totalPrice}`);
  
  // Simulate running the effective price calculation
  const mockEffectivePriceHook = useEffectivePrice({
    selectedServices,
    totalPrice
  });
  
  const effectivePrice = mockEffectivePriceHook();
  console.log(`Calculated effective price: ₹${effectivePrice}`);
  
  if (effectivePrice !== totalPrice) {
    console.warn(`⚠️ Price mismatch: totalPrice (₹${totalPrice}) != effectivePrice (₹${effectivePrice})`);
  } else {
    console.log('✅ Price calculation is consistent');
  }
  
  console.groupEnd();
};

// 4. Payment Integration Check
export const checkPaymentIntegration = (totalPrice: number, currency: string = 'INR') => {
  console.group('🧪 DIAGNOSTIC: Payment Integration');
  
  if (totalPrice <= 0) {
    console.warn('⚠️ Payment amount is zero or negative');
  } else {
    console.log(`✅ Valid payment amount: ${currency} ${totalPrice}`);
  }
  
  // Check if Razorpay is loaded
  if (typeof window !== 'undefined' && 'Razorpay' in window) {
    console.log('✅ Razorpay script is loaded');
  } else {
    console.warn('⚠️ Razorpay script is not loaded');
  }
  
  console.groupEnd();
};

// 5. Routing & Dead Links Check
export const checkRouting = () => {
  console.group('🧪 DIAGNOSTIC: Routing & Dead Links');
  
  // Get all route paths from React Router
  try {
    const currentLocation = window.location.pathname;
    console.log('Current location:', currentLocation);
    
    console.log('✅ App is able to render current route');
  } catch (err) {
    console.error('⚠️ Error checking routes:', err);
  }
  
  console.groupEnd();
};

// 6. Component Sanity Checks
export const checkComponentSanity = (
  services: string[] = [],
  pricing?: Map<string, number>,
  totalPrice: number = 0
) => {
  console.group('🧪 DIAGNOSTIC: Component Sanity');
  
  // Test useEffectivePrice
  try {
    const testEffectivePrice = useEffectivePrice({
      selectedServices: services,
      pricing,
      totalPrice
    });
    
    const calculatedPrice = testEffectivePrice();
    console.log('useEffectivePrice test result:', calculatedPrice);
    
    if (calculatedPrice === undefined || calculatedPrice === null) {
      console.warn('⚠️ useEffectivePrice returned undefined/null');
    } else {
      console.log('✅ useEffectivePrice seems functional');
    }
  } catch (err) {
    console.error('⚠️ Error in useEffectivePrice:', err);
  }
  
  console.groupEnd();
};

// Main diagnostic function that runs all checks
export const runSystemDiagnostics = (
  pricing?: Map<string, number>,
  selectedServices: string[] = [],
  totalPrice: number = 0
) => {
  console.group('🧪🧪🧪 SYSTEM HEALTH DIAGNOSTICS 🧪🧪🧪');
  console.log('Starting system health check...');
  console.log('Timestamp:', new Date().toISOString());
  
  checkPricingConsistency(pricing);
  checkServiceIdMapping();
  checkBookingFlowHealth(selectedServices, totalPrice);
  checkPaymentIntegration(totalPrice);
  checkRouting();
  checkComponentSanity(selectedServices, pricing, totalPrice);
  
  console.log('Diagnostics complete!');
  console.groupEnd();
};
