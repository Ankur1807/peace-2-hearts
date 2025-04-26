
import { useState } from 'react';
import { PersonalDetails } from '@/utils/types';

export function useBookingState() {
  // Date and time selection
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [timeframe, setTimeframe] = useState('');
  
  return {
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe
  };
}
