
/**
 * Format a date to a localized string
 * @param date Date to format
 * @param locale Locale to use for formatting (default: 'en-GB')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined, locale: string = 'en-GB'): string => {
  if (!date) return '';
  
  // Handle both string and Date objects
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid before formatting
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }
  
  return dateObj.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
