
import { useState } from 'react';
import { PersonalDetails } from '@/utils/types';

export function usePersonalDetailsState() {
  // Personal details
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Handler for personal details changes
  const handlePersonalDetailsChange = (details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setPersonalDetails(details);
  };

  return {
    personalDetails,
    handlePersonalDetailsChange,
  };
}
