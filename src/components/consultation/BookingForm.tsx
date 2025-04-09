
import React from 'react';
import { PersonalDetails } from '@/utils/types';
import ServiceSection from './form/ServiceSection';
import DateTimeSection from './form/DateTimeSection';
import PersonalDetailsFields from './PersonalDetailsFields';
import PricingSection from './form/PricingSection';
import FormActions from './FormActions';
import { isFormValid } from './form/ValidationHelper';

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
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(e);
    }} className="space-y-6">
      <ServiceSection
        serviceCategory={serviceCategory}
        setServiceCategory={setServiceCategory}
        selectedServices={selectedServices}
        handleServiceSelection={handleServiceSelection}
        handlePackageSelection={handlePackageSelection}
        pricing={pricing}
      />
      
      <DateTimeSection
        serviceCategory={serviceCategory}
        date={date}
        setDate={setDate}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
      />
      
      <PersonalDetailsFields 
        personalDetails={personalDetails}
        handlePersonalDetailsFieldChange={handlePersonalDetailsFieldChange}
      />
      
      <PricingSection
        selectedServices={selectedServices}
        pricing={pricing}
        totalPrice={totalPrice}
      />
      
      <FormActions 
        isFormValid={isFormValid(
          serviceCategory,
          selectedServices,
          date,
          timeSlot,
          timeframe,
          personalDetails
        )} 
        isProcessing={isProcessing} 
        totalPrice={totalPrice} 
      />
    </form>
  );
};

export default BookingForm;
