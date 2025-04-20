
import { 
  fetchServicePricingData,
  fetchAllServiceData
} from './pricingQueries';

/**
 * Calculate package price based on component services
 * @param packageId - Package ID
 * @returns Calculated package price or 0 if not available
 */
export async function calculatePackagePrice(packageId: string): Promise<number> {
  console.log(`Calculating price for package: ${packageId}`);
  
  let serviceIds: string[] = [];
  
  if (packageId === 'divorce-prevention') {
    serviceIds = ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal'];
    console.log('Calculating divorce prevention package from services:', serviceIds);
  } else if (packageId === 'pre-marriage-clarity') {
    serviceIds = ['pre-marriage-legal', 'premarital-counselling-individual', 'mental-health-counselling'];
    console.log('Calculating pre-marriage clarity package from services:', serviceIds);
  } else {
    return 0;
  }
  
  try {
    // First try to get direct package price from database
    const packageDbId = packageId === 'divorce-prevention' 
      ? 'P2H-H-divorce-prevention-package' 
      : 'P2H-H-pre-marriage-clarity-solutions';
    
    // Query the database for the package directly
    const { data: packageData, error: packageError } = await supabase
      .from('service_pricing')
      .select('price')
      .eq('type', 'package')
      .ilike('service_id', `%${packageDbId}%`)  // Use ILIKE for case-insensitive search with wildcards
      .eq('is_active', true)
      .single();
    
    if (packageData && packageData.price) {
      console.log(`Found direct package price in database for ${packageId}: ${packageData.price}`);
      return packageData.price;
    }
    
    // If package not found directly, calculate from component services
    console.log('Package not found directly, calculating from component services');
    
    // Fetch prices for component services
    const servicesData = await fetchServicePricingData(serviceIds);
    
    if (!servicesData || servicesData.length === 0) {
      console.log('No service pricing data found for package components');
      
      // Try to log all available services for debugging
      try {
        const allServices = await fetchAllServiceData();
        console.log('All available services in database:', allServices.map(s => s.service_id));
      } catch (error) {
        console.error('Failed to fetch all services for debugging:', error);
      }
      
      return 0;
    }
    
    // Create a map of service_id to price
    const servicesPriceMap = new Map<string, number>();
    const dbToClientServiceIdMap: Record<string, string> = {};
    
    // Map of client service IDs to database service IDs
    const clientToDbServiceIdMap: Record<string, string[]> = {
      'mental-health-counselling': ['Mental-Health-Counselling', 'P2H-MH-mental-health-counselling'],
      'family-therapy': ['Family-Therapy', 'P2H-MH-family-therapy'],
      'premarital-counselling-individual': ['Premarital-Counselling', 'P2H-MH-premarital-counselling-individual'],
      'couples-counselling': ['Couples-Counselling', 'P2H-MH-couples-counselling'],
      'sexual-health-counselling-individual': ['Sexual-Health-Counselling', 'P2H-MH-sexual-health-counselling'],
      'pre-marriage-legal': ['Pre-Marriage-Legal-Consultation', 'P2H-L-pre-marriage-legal-consultation'],
      'divorce': ['Divorce-Consultation', 'P2H-L-divorce-consultation'],
      'custody': ['Child-Custody-Consultation', 'P2H-L-child-custody-consultation'],
      'mediation': ['Mediation-Services', 'P2H-L-mediation-services'],
      'maintenance': ['Maintenance-Consultation', 'P2H-L-maintenance-consultation'],
      'general-legal': ['General-Legal-Consultation', 'P2H-L-general-legal-consultation']
    };
    
    // Create reverse mapping for db to client IDs
    Object.entries(clientToDbServiceIdMap).forEach(([clientId, dbIds]) => {
      dbIds.forEach(dbId => {
        dbToClientServiceIdMap[dbId] = clientId;
      });
    });
    
    // Populate the services price map
    servicesData.forEach((item) => {
      if (item.price && item.price > 0) {
        const clientId = dbToClientServiceIdMap[item.service_id.trim()] || item.service_id;
        servicesPriceMap.set(clientId, item.price);
        console.log(`Adding price mapping: ${clientId} => ${item.price}`);
      }
    });
    
    // Calculate package total
    let packageTotal = 0;
    let allServicesHavePrices = true;
    
    serviceIds.forEach(serviceId => {
      const servicePrice = servicesPriceMap.get(serviceId);
      if (servicePrice && servicePrice > 0) {
        packageTotal += servicePrice;
        console.log(`Adding ${servicePrice} for ${serviceId}`);
      } else {
        allServicesHavePrices = false;
        console.log(`Missing price for ${serviceId}`);
      }
    });
    
    // Apply package discount if all services have prices
    if (packageTotal > 0 && allServicesHavePrices) {
      packageTotal = Math.round(packageTotal * 0.85); // 15% discount
      console.log(`Set package price for ${packageId}: ${packageTotal} (after 15% discount)`);
    } else if (packageTotal > 0) {
      console.log(`Set partial package price for ${packageId}: ${packageTotal} (no discount applied)`);
    }
    
    return packageTotal;
  } catch (error) {
    console.error('Error calculating package price:', error);
    return 0;
  }
}
