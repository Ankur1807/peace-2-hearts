
import { useState, useCallback } from 'react';
import { PersonalDetails } from '@/utils/types';

export function usePersonalDetailsState() {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handlePersonalDetailsChange = useCallback((details: PersonalDetails) => {
    console.log("Updating personal details:", details);
    setPersonalDetails(details);
  }, []);

  return {
    personalDetails,
    handlePersonalDetailsChange
  };
}
