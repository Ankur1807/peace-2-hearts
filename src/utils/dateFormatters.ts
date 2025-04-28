
/**
 * Format a date to a localized string
 * @param date Date to format
 * @param locale Locale to use for formatting (default: 'en-GB')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined, locale: string = 'en-GB'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
