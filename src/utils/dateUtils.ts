
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
 * Convert IST date and time to UTC for database storage
 * Properly handles the IST (+5:30) to UTC conversion
 */
export function convertISTDateTimeToUTC(dateString: string | Date, timeSlot: string): string {
  // Handle Date object conversion
  const dateStr = dateString instanceof Date ? 
    dateString.toISOString().split('T')[0] : 
    typeof dateString === 'string' ? dateString : '';
    
  // Parse time from the timeSlot format (e.g., "11-am", "2-pm")
  const [hourStr, meridian] = timeSlot.split('-');
  let hour = parseInt(hourStr, 10);
  
  // Convert to 24-hour format
  if (meridian.toLowerCase() === 'pm' && hour < 12) {
    hour += 12;
  } else if (meridian.toLowerCase() === 'am' && hour === 12) {
    hour = 0;
  }
  
  // Create date with explicit IST timezone offset
  const istDate = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00+05:30`);
  
  console.log('[convertISTDateTimeToUTC] Input:', {
    dateString,
    timeSlot,
    parsedHour: hour,
    istDateObj: istDate,
    istDateStr: istDate.toString()
  });
  
  // Convert to UTC ISO string
  const utcString = istDate.toISOString();
  console.log('[convertISTDateTimeToUTC] Output UTC:', utcString);
  
  return utcString;
}

/**
 * Convert local date and time to UTC for storage
 * Properly handles IST (+5:30) to UTC conversion
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
    
    // Set the time components on the local date
    localDate.setHours(hours, 0, 0, 0);
    
    // Convert to proper UTC value - NO OFFSET CORRECTION NEEDED
    // JavaScript Date's toISOString() already handles the timezone conversion correctly
    // as long as the Date object itself has the correct local time
    
    // Log for debugging
    console.log(`[convertLocalDateTimeToUTC] Original date input:`, date);
    console.log(`[convertLocalDateTimeToUTC] Time slot:`, timeSlot);
    console.log(`[convertLocalDateTimeToUTC] Parsed hours:`, hours);
    console.log(`[convertLocalDateTimeToUTC] Local date with time:`, localDate.toString());
    console.log(`[convertLocalDateTimeToUTC] UTC ISO string:`, localDate.toISOString());
    console.log(`[convertLocalDateTimeToUTC] UTC timestamp:`, localDate.getTime());
    
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
