
/**
 * Format a date to ISO string
 */
export function formatDateISOString(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  return date.toISOString();
}

/**
 * Format a date to a human-readable format
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | undefined): boolean {
  if (!date) return false;
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Convert local date and time to UTC for storage
 * This ensures date/time selected in IST is properly converted to UTC
 */
export function convertLocalDateTimeToUTC(date: Date | undefined, timeSlot: string): string | undefined {
  if (!date) return undefined;
  
  try {
    // Clone the date to avoid mutating the original
    const localDate = new Date(date);
    
    // Parse the time from timeSlot format (e.g., "11-am", "2-pm")
    let hours = 0;
    if (timeSlot) {
      const [hourStr, meridiem] = timeSlot.split('-');
      hours = parseInt(hourStr, 10);
      
      // Convert 12-hour format to 24-hour
      if (meridiem.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      } else if (meridiem.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
    }
    
    // Set the time components
    localDate.setHours(hours, 0, 0, 0);
    
    // Log for debugging
    console.log(`[convertLocalDateTimeToUTC] Local date/time: ${localDate.toString()}`);
    console.log(`[convertLocalDateTimeToUTC] UTC ISO string: ${localDate.toISOString()}`);
    
    // Return the ISO string (which is in UTC)
    return localDate.toISOString();
  } catch (error) {
    console.error('Error converting date/time to UTC:', error);
    return undefined;
  }
}

/**
 * Format a local date and time for display
 */
export function formatLocalDateTime(date: Date | string | undefined, timeSlot: string | undefined): string {
  if (!date) return 'Date to be confirmed';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format time if provided
    if (timeSlot) {
      const formattedTime = timeSlot.replace('-', ':').toUpperCase();
      return `${formattedDate} at ${formattedTime}`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting local date and time:', error);
    return 'Invalid date/time';
  }
}
