
import { BookingDetails } from '@/utils/types';

export function serializeBookingDetails(details: BookingDetails): any {
  return {
    ...details,
    date: details.date ? details.date.toISOString() : undefined,
    // Ensure personalDetails is also serialized properly if present
    personalDetails: details.personalDetails ? {
      ...details.personalDetails
    } : undefined
  };
}

export function deserializeBookingDetails(serialized: any): BookingDetails {
  return {
    ...serialized,
    date: serialized.date ? new Date(serialized.date) : undefined,
    // Ensure personalDetails is also deserialized properly if present
    personalDetails: serialized.personalDetails ? {
      ...serialized.personalDetails
    } : undefined
  };
}
