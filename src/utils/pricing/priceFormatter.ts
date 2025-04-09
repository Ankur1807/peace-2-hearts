
/**
 * Format price for display
 * @param price - Price to format
 * @param currency - Currency code (default: INR)
 * @returns Formatted price string
 */
export function formatPrice(price: number | undefined, currency: string = 'INR'): string {
  if (price === undefined || price <= 0) return 'Price not available';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(price);
}
