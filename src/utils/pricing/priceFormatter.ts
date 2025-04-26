
/**
 * Format a price value with currency
 * @param price - Price value to format
 * @param currency - Currency code (default: INR)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
