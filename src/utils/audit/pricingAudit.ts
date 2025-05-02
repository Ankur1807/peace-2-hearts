
import { fetchServicePricing, fetchPackagePricing } from '@/utils/pricing';
import { clientToDbIdMap, dbToClientIdMap } from '@/utils/consultation/serviceIdMapper';
import { useEffectivePrice } from '@/hooks/consultation/payment/useEffectivePrice';
import { supabase } from '@/integrations/supabase/client';

// Service audit interfaces
interface ServiceAuditItem {
  serviceId: string;
  serviceName: string;
  dbServiceId: string;
  expectedPrice: number | null;
  effectivePrice: number | null;
  priceInMap: number | null;
  status: 'match' | 'mismatch' | 'missing' | 'unknown';
  issues: string[];
}

interface AuditReport {
  services: ServiceAuditItem[];
  packages: ServiceAuditItem[];
  summary: {
    totalServices: number;
    matchingPrices: number;
    mismatchedPrices: number;
    missingPrices: number;
    totalPackages: number;
  };
  timestamp: string;
}

// List of all client-side services to audit
const mentalHealthServices = [
  'mental-health-counselling',
  'family-therapy',
  'couples-counselling',
  'premarital-counselling-individual',
  'premarital-counselling-couple',
  'sexual-health-counselling',
  'test-service'
];

const legalServices = [
  'pre-marriage-legal',
  'mediation',
  'divorce',
  'custody',
  'maintenance',
  'general-legal'
];

const holisticPackages = [
  'divorce-prevention',
  'pre-marriage-clarity'
];

// Main audit function
export async function auditServicePricing(): Promise<AuditReport> {
  console.log('Starting pricing audit...');
  const allServices = [...mentalHealthServices, ...legalServices];
  const allPackages = [...holisticPackages];
  
  // Fetch pricing data from Supabase directly for verification
  const { data: dbServicePricing } = await supabase
    .from('service_pricing')
    .select('service_id, service_name, price, is_active, type')
    .eq('is_active', true);

  console.log('DB Service pricing data:', dbServicePricing);
  
  // Fetch pricing using the existing application logic
  const servicePricingMap = await fetchServicePricing(allServices);
  const packagePricingMap = await fetchPackagePricing(allPackages);
  
  console.log('Service pricing from app logic:', Object.fromEntries(servicePricingMap));
  console.log('Package pricing from app logic:', Object.fromEntries(packagePricingMap));
  
  // Audit services
  const serviceAuditResults = await Promise.all(
    allServices.map(async (serviceId) => {
      const dbServiceId = clientToDbIdMap[serviceId] || serviceId;
      const dbRecord = dbServicePricing?.find(record => 
        record.service_id === dbServiceId && record.type === 'service'
      );
      
      const issues: string[] = [];
      const priceInMap = servicePricingMap.get(serviceId) || null;
      const expectedPrice = dbRecord?.price || null;
      
      // Calculate effective price
      const mockGetEffectivePrice = () => {
        // Similar logic to useEffectivePrice hook
        if (serviceId === 'test-service' && priceInMap !== undefined && priceInMap > 0) {
          return priceInMap;
        } else if (serviceId === 'test-service') {
          return 11; // Default fallback value
        } else if (priceInMap !== undefined && priceInMap > 0) {
          return priceInMap;
        }
        return null;
      };
      
      const effectivePrice = mockGetEffectivePrice();
      
      // Determine status and issues
      let status: 'match' | 'mismatch' | 'missing' | 'unknown' = 'unknown';
      
      if (!dbRecord) {
        status = 'missing';
        issues.push('No entry in Supabase service_pricing table');
      } else if (expectedPrice === null) {
        status = 'missing';
        issues.push('Price not set in Supabase');
      } else if (priceInMap === null) {
        status = 'missing';
        issues.push('Price not fetched by application logic');
      } else if (effectivePrice !== expectedPrice) {
        status = 'mismatch';
        issues.push(`Price mismatch: Expected ₹${expectedPrice}, but got ₹${effectivePrice}`);
      } else {
        status = 'match';
      }
      
      // Special case for test service
      if (serviceId === 'test-service' && priceInMap === 11 && !dbRecord) {
        issues.push('Using hardcoded fallback price of 11');
      }
      
      return {
        serviceId,
        serviceName: dbRecord?.service_name || serviceId,
        dbServiceId,
        expectedPrice,
        priceInMap,
        effectivePrice,
        status,
        issues
      };
    })
  );
  
  // Audit packages
  const packageAuditResults = await Promise.all(
    allPackages.map(async (packageId) => {
      const dbPackageId = clientToDbIdMap[packageId] || packageId;
      const dbRecord = dbServicePricing?.find(record => 
        record.service_id === dbPackageId && record.type === 'package'
      );
      
      const issues: string[] = [];
      const priceInMap = packagePricingMap.get(packageId) || null;
      const expectedPrice = dbRecord?.price || null;
      
      // Calculate effective price
      const mockGetEffectivePrice = () => {
        if (priceInMap !== undefined && priceInMap > 0) {
          return priceInMap;
        }
        return null;
      };
      
      const effectivePrice = mockGetEffectivePrice();
      
      // Determine status and issues
      let status: 'match' | 'mismatch' | 'missing' | 'unknown' = 'unknown';
      
      if (!dbRecord) {
        status = 'missing';
        issues.push('No entry in Supabase service_pricing table');
      } else if (expectedPrice === null) {
        status = 'missing';
        issues.push('Price not set in Supabase');
      } else if (priceInMap === null) {
        status = 'missing';
        issues.push('Price not fetched by application logic');
      } else if (effectivePrice !== expectedPrice) {
        status = 'mismatch';
        issues.push(`Price mismatch: Expected ₹${expectedPrice}, but got ₹${effectivePrice}`);
      } else {
        status = 'match';
      }
      
      // Check for default fallbacks
      if ((packageId === 'divorce-prevention' && priceInMap === 8500 && !dbRecord) || 
          (packageId === 'pre-marriage-clarity' && priceInMap === 4500 && !dbRecord)) {
        issues.push(`Using hardcoded fallback price of ${priceInMap}`);
      }
      
      return {
        serviceId: packageId,
        serviceName: dbRecord?.service_name || packageId,
        dbServiceId: dbPackageId,
        expectedPrice,
        priceInMap,
        effectivePrice,
        status,
        issues
      };
    })
  );
  
  // Generate summary statistics
  const serviceSummary = {
    totalServices: serviceAuditResults.length,
    matchingPrices: serviceAuditResults.filter(item => item.status === 'match').length,
    mismatchedPrices: serviceAuditResults.filter(item => item.status === 'mismatch').length,
    missingPrices: serviceAuditResults.filter(item => item.status === 'missing').length,
    totalPackages: packageAuditResults.length
  };
  
  return {
    services: serviceAuditResults,
    packages: packageAuditResults,
    summary: serviceSummary,
    timestamp: new Date().toISOString()
  };
}
