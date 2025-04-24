
import React from 'react';
import BookingForm from './BookingForm';
import { PersonalDetails } from '@/utils/types';

interface ConsultationDetailsFormProps {
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  handleServiceSelection: (serviceId: string, checked: boolean) => void;
  handlePackageSelection: (packageId: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (slot: string) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  personalDetails: any;
  handlePersonalDetailsFieldChange: (field: string, value: string) => void;
  isProcessing: boolean;
  pricing: Map<string, number>;
  totalPrice: number;
  onSubmit: () => void;
}

const ConsultationDetailsForm: React.FC<ConsultationDetailsFormProps> = (props) => {
  return (
    <BookingForm
      serviceCategory={props.serviceCategory}
      setServiceCategory={props.setServiceCategory}
      selectedServices={props.selectedServices}
      handleServiceSelection={props.handleServiceSelection}
      handlePackageSelection={props.handlePackageSelection}
      date={props.date}
      setDate={props.setDate}
      timeSlot={props.timeSlot}
      setTimeSlot={props.setTimeSlot}
      timeframe={props.timeframe}
      setTimeframe={props.setTimeframe}
      personalDetails={props.personalDetails}
      handlePersonalDetailsFieldChange={props.handlePersonalDetailsFieldChange}
      isProcessing={props.isProcessing}
      pricing={props.pricing}
      totalPrice={props.totalPrice}
      onSubmit={props.onSubmit}
    />
  );
};

export default ConsultationDetailsForm;
