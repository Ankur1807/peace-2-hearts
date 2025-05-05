
// 🚧 Temporary fallback pricing — remove after Supabase pricing migration (ETA: May 20)

// Fallback prices organized by category
export const fallbackPrices: Record<string, number> = {
  // Mental Health Services
  'mental-health-counselling': 2500,
  'couples-counselling': 3000,
  'family-therapy': 3500,
  'premarital-counselling': 2500,
  'sexual-health-counselling': 3000,
  
  // Legal Services
  'divorce-consultation': 3500,
  'child-custody-consultation': 4000,
  'general-legal-consultation': 2500,
  'pre-marriage-legal': 3000,
  'maintenance-consultation': 3500,
  'mediation-services': 4500,
  
  // Holistic Packages
  'divorce-prevention': 8500,
  'pre-marriage-clarity': 4500,
  
  // Test Service (used in development/testing)
  'test-service': 11
};

/**
 * Returns the fallback price for a given service ID
 * @param serviceId The service ID to get the price for
 * @returns The price if found, otherwise undefined
 */
export function getFallbackPrice(serviceId: string): number | undefined {
  return fallbackPrices[serviceId];
}

/**
 * Gets all fallback prices for a specific category
 * @param category The category to filter by (e.g., 'mental-health', 'legal', etc.)
 * @returns Record of service IDs and prices for the specified category
 */
export function getCategoryFallbackPrices(category: string): Record<string, number> {
  const result: Record<string, number> = {};
  
  Object.entries(fallbackPrices).forEach(([serviceId, price]) => {
    if (serviceId.includes(category)) {
      result[serviceId] = price;
    }
  });
  
  return result;
}
