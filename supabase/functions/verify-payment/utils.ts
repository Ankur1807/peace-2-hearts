
/**
 * Utility functions for payment verification
 */

/**
 * Determines the service category based on service type
 */
export function determineServiceCategory(serviceType: string | null | undefined): string {
  if (!serviceType) return 'legal';
  
  const serviceTypeLower = serviceType.toLowerCase();
  
  if (serviceTypeLower.includes('divorce-prevention') || 
      serviceTypeLower.includes('pre-marriage-clarity') ||
      serviceTypeLower.includes('relationship-counseling')) {
    return 'holistic';
  }
  
  if (serviceTypeLower.includes('legal') || 
      serviceTypeLower.includes('divorce') || 
      serviceTypeLower.includes('custody')) {
    return 'legal';
  }
  
  if (serviceTypeLower.includes('therapy') || 
      serviceTypeLower.includes('counseling') || 
      serviceTypeLower.includes('mental')) {
    return 'mental';
  }
  
  // Default to legal if can't determine
  return 'legal';
}

/**
 * Format price for display (converts from paise to rupees)
 */
export function formatPrice(amount: number): string {
  // Razorpay amounts are in paise, convert to rupees
  const amountInRupees = amount / 100;
  return `₹${amountInRupees.toFixed(2)}`;
}
