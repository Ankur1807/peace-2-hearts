
/**
 * Format a price as currency
 * @param price - Price to format
 * @param currency - Currency code (default: INR)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'INR'): string {
  if (isNaN(price) || price === null) {
    return '₹0';
  }

  // Use Intl.NumberFormat for proper currency formatting
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  });

  return formatter.format(price);
}

/**
 * Format a discount value
 * @param value - Discount value
 * @param type - Discount type ('percentage' or 'fixed')
 * @returns Formatted discount string
 */
export function formatDiscount(value: number, type: string): string {
  if (isNaN(value) || value === null) {
    return '-';
  }

  if (type === 'percentage') {
    return `${value}%`;
  }

  // Use Intl.NumberFormat for proper currency formatting
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  });

  return formatter.format(value);
}
