import { SerializedBookingDetails } from '@/utils/types';

/**
 * Processes and formats date from booking details
 */
export function processBookingDate(bookingDetails: SerializedBookingDetails): SerializedBookingDetails {
  // Handle date conversion
  if (bookingDetails.date) {
    // Properly check for Date object with type guards
    const dateValue = bookingDetails.date;
    
    // First check if it's an object
    if (typeof dateValue === 'object' && dateValue !== null) {
      // Then check if it has getTime method which is specific to Date objects
      if ('getTime' in dateValue && dateValue !== null) {
        // Ensure getTime is a function before attempting to cast
        const getTimeProperty = dateValue.getTime;
        if (typeof getTimeProperty === 'function') {
          // Now we can safely cast to Date
          const dateObject = dateValue as unknown as Date;
          // Check if it's a valid date
          if (!isNaN(dateObject.getTime())) {
            // Convert Date to ISO string for API transmission
            const updatedDetails = {
              ...bookingDetails,
              date: dateObject.toISOString()
            };
            
            // Add a formatted date for display
            const formattedDate = dateObject.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            updatedDetails.formattedDate = formattedDate;
            
            return updatedDetails;
          }
        }
      }
    } else if (typeof dateValue === 'string') {
      // Keep string as is
      return bookingDetails;
    }
  }
  
  // Return original if no date processing needed
  return bookingDetails;
}
