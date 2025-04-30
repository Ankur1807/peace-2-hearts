
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
 * Convert IST time slot to UTC ISO string
 * Properly handles the IST (+5:30) to UTC conversion
 * Always returns an ISO string for database storage
 */
export function convertISTTimeSlotToUTCString(dateString: string, timeSlot: string): string {
  const [hourStr, meridian] = timeSlot.split('-');
  let hour = parseInt(hourStr, 10);
  if (meridian.toLowerCase() === 'pm' && hour < 12) hour += 12;
  if (meridian.toLowerCase() === 'am' && hour === 12) hour = 0;
  const istDate = new Date(`${dateString}T${hour.toString().padStart(2, '0')}:00:00+05:30`);
  console.log(`[convertISTTimeSlotToUTCString] Converting IST date: ${dateString}, time: ${timeSlot} to UTC: ${istDate.toISOString()}`);
  return istDate.toISOString(); // returns a UTC-formatted ISO string
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
