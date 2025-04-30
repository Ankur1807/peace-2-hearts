
import { BookingDetails, SerializedBookingDetails } from '@/utils/types';

/**
 * Process booking date for serialization and email formatting
 */
export function processBookingDate(bookingDetails: SerializedBookingDetails): SerializedBookingDetails {
  try {
    const result = { ...bookingDetails };
    
    // Format the date if it exists
    if (bookingDetails.date) {
      try {
        // Ensure we have a Date object to work with
        let dateObj: Date;
        
        if (typeof bookingDetails.date === 'string') {
          dateObj = new Date(bookingDetails.date);
          console.log("[processBookingDate] Converted string date to Date object:", dateObj.toString());
        } else if (bookingDetails.date instanceof Date) {
          dateObj = bookingDetails.date;
          console.log("[processBookingDate] Using provided Date object:", dateObj.toString());
        } else {
          throw new Error('Invalid date format');
        }
        
        if (!isNaN(dateObj.getTime())) {
          // Log for debugging timezone issues
          console.log("[processBookingDate] Raw date value:", bookingDetails.date);
          console.log("[processBookingDate] Date object:", dateObj.toString());
          console.log("[processBookingDate] Date ISO string:", dateObj.toISOString());
          console.log("[processBookingDate] Local date string:", dateObj.toLocaleString());
          
          // Format date in local timezone for display
          result.formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          // Format time separately if available
          if (bookingDetails.timeSlot) {
            result.formattedTime = bookingDetails.timeSlot.replace('-', ':').toUpperCase();
            console.log("[processBookingDate] Formatted time:", result.formattedTime);
          }
          
          console.log("[processBookingDate] Formatted date:", result.formattedDate);
          console.log("[processBookingDate] Formatted time:", result.formattedTime);
        }
      } catch (dateError) {
        console.error('Error formatting date:', dateError, 'Original date:', bookingDetails.date);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error processing date:', error);
    return bookingDetails;
  }
}
