
import { BookingDetails } from '@/utils/types';

export function serializeBookingDetails(details: BookingDetails): any {
  return {
    ...details,
    date: details.date ? details.date.toISOString() : undefined
  };
}

export function deserializeBookingDetails(serialized: any): BookingDetails {
  return {
    ...serialized,
    date: serialized.date ? new Date(serialized.date) : undefined
  };
}
