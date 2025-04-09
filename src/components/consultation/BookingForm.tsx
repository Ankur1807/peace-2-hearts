
import React from 'react';
import { Card } from '@/components/ui/card';
import ServiceCategorySelector from './ServiceCategorySelector';
import ServiceSelectionOptions from './ServiceSelectionOptions';
import DateTimePicker from './DateTimePicker';
import TimeframeSelector from './TimeframeSelector';
import PersonalDetailsFields from './PersonalDetailsFields';
import PriceSummary from './PriceSummary';
import FormActions from './FormActions';
import { PersonalDetails } from '@/utils/types';

interface BookingFormProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  selectedServices: string[];
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  personalDetails: PersonalDetails;
  handlePersonalDetailsFieldChange: (field: string, value: string) => void;
  isProcessing: boolean;
  pricing: Map<string, number>;
  totalPrice: number;
  onSubmit: (e: React.FormEvent) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  serviceCategory,
  setServiceCategory,
  selectedServices,
  handleServiceSelection,
  handlePackageSelection,
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  timeframe,
  setTimeframe,
  personalDetails,
  handlePersonalDetailsFieldChange,
  isProcessing,
  pricing,
  totalPrice,
  onSubmit
}) => {
  const isFormValid = () => {
    if (serviceCategory === 'holistic') {
      return (
        selectedServices.length > 0 &&
        timeframe !== '' &&
        personalDetails.firstName.trim() !== '' &&
        personalDetails.lastName.trim() !== '' &&
        personalDetails.email.trim() !== '' &&
        personalDetails.phone.trim() !== ''
      );
    } else {
      return (
        selectedServices.length > 0 &&
        date !== undefined &&
        timeSlot !== '' &&
        personalDetails.firstName.trim() !== '' &&
        personalDetails.lastName.trim() !== '' &&
        personalDetails.email.trim() !== '' &&
        personalDetails.phone.trim() !== ''
      );
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e);
    }} className="space-y-6">
      <ServiceCategorySelector 
        serviceCategory={serviceCategory}
        setServiceCategory={setServiceCategory}
      />
      
      <ServiceSelectionOptions 
        serviceCategory={serviceCategory}
        selectedServices={selectedServices}
        handleServiceSelection={handleServiceSelection}
        handlePackageSelection={handlePackageSelection}
        pricing={pricing}
      />
      
      {serviceCategory === 'holistic' ? (
        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      ) : (
        <DateTimePicker 
          date={date}
          setDate={setDate}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
        />
      )}
      
      <PersonalDetailsFields 
        personalDetails={personalDetails}
        handlePersonalDetailsFieldChange={handlePersonalDetailsFieldChange}
      />
      
      {selectedServices.length > 0 && (
        <PriceSummary 
          services={selectedServices}
          pricing={pricing}
          totalPrice={totalPrice}
          currency="INR"
        />
      )}
      
      <FormActions 
        isFormValid={isFormValid()} 
        isProcessing={isProcessing} 
        totalPrice={totalPrice} 
      />
    </form>
  );
};

export default BookingForm;
