
import { useState } from 'react';
import { PersonalDetails } from '@/utils/types';

// Hook for managing consultation state
export function useConsultationState() {
  // Date and time selection
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [timeframe, setTimeframe] = useState('');
  
  // Service selection
  const [serviceCategory, setServiceCategory] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Personal details
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Pricing data - no longer initialized with hardcoded values
  // Just maintain the state variables for compatibility
  const [pricing, setPricing] = useState<Map<string, number>>(new Map());
  
  // Total price
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Handler for personal details changes
  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setPersonalDetails(details);
  };

  return {
    date,
    setDate,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    personalDetails,
    handlePersonalDetailsChange,
    pricing,
    setPricing,
    totalPrice,
    setTotalPrice
  };
}
