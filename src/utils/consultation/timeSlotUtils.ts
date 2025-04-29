
/**
 * Utils for handling time slots in consultations
 */

/**
 * Get a human-readable label for a time slot
 */
export function getTimeSlotLabel(timeSlot: string): string {
  // Handle common time slot formats
  if (timeSlot.includes(':')) {
    return timeSlot; // Already formatted as HH:MM
  }
  
  // Convert slot IDs to readable format
  const slotMap: Record<string, string> = {
    'morning': '9:00 AM - 12:00 PM',
    'afternoon': '12:00 PM - 3:00 PM',
    'evening': '3:00 PM - 6:00 PM',
    'night': '6:00 PM - 9:00 PM',
    'slot-1': '9:00 AM - 10:00 AM',
    'slot-2': '10:00 AM - 11:00 AM',
    'slot-3': '11:00 AM - 12:00 PM',
    'slot-4': '12:00 PM - 1:00 PM',
    'slot-5': '1:00 PM - 2:00 PM',
    'slot-6': '2:00 PM - 3:00 PM',
    'slot-7': '3:00 PM - 4:00 PM',
    'slot-8': '4:00 PM - 5:00 PM',
    'slot-9': '5:00 PM - 6:00 PM',
    'slot-10': '6:00 PM - 7:00 PM',
    'slot-11': '7:00 PM - 8:00 PM',
    'slot-12': '8:00 PM - 9:00 PM'
  };
  
  return slotMap[timeSlot] || timeSlot;
}

/**
 * Get time slots for a particular day
 */
export function getAvailableTimeSlots(date?: Date): string[] {
  // This is a placeholder. In a real implementation, this would fetch
  // available slots from an API or database based on the date
  return [
    'slot-1',
    'slot-2',
    'slot-3',
    'slot-4',
    'slot-5',
    'slot-6',
    'slot-7',
    'slot-8'
  ];
}
