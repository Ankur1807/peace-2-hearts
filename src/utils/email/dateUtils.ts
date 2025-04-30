
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
        const dateObj = new Date(bookingDetails.date);
        
        if (!isNaN(dateObj.getTime())) {
          // Log for debugging timezone issues
          console.log("[processBookingDate] Raw date value:", bookingDetails.date);
          console.log("[processBookingDate] Date object:", dateObj.toString());
          
          // Format date in local timezone (IST)
          result.formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          console.log("[processBookingDate] Formatted date:", result.formattedDate);
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
