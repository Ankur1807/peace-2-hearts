import React from 'react';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ServiceCategorySelector from './ServiceCategorySelector';
import ServiceSelectionStep from './ServiceSelectionStep';
import DateTimePicker from './DateTimePicker';
import TimeframeSelector from './TimeframeSelector';
import ConsultationAlert from './ConsultationAlert';
import PersonalDetailsStep from './PersonalDetailsStep';
import ConfirmationStep from './ConfirmationStep';
import SuccessView from './SuccessView';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({
  bookingState
}) => {
  const {
    date,
    serviceCategory,
    selectedServices,
    timeSlot,
    timeframe,
    submitted,
    isProcessing,
    referenceId,
    bookingError,
    personalDetails,
    bookingDetails,
    setDate,
    setServiceCategory,
    setSelectedServices,
    setTimeSlot,
    setTimeframe,
    handlePersonalDetailsChange,
    handleConfirmBooking
  } = bookingState;

  const [currentStep, setCurrentStep] = React.useState(1);
  
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <SuccessView referenceId={referenceId} bookingDetails={bookingDetails} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <StepIndicator currentStep={currentStep} />
      
      {bookingError && (
        <ConsultationAlert message={bookingError} />
      )}

      <div className="mb-6">
        {currentStep === 1 && (
          <ServiceCategorySelector
            serviceCategory={serviceCategory}
            setServiceCategory={setServiceCategory}
            nextStep={nextStep}
          />
        )}

        {currentStep === 2 && (
          <ServiceSelectionStep
            serviceCategory={serviceCategory}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 3 && serviceCategory === 'holistic' && (
          <TimeframeSelector
            timeframe={timeframe}
            setTimeframe={setTimeframe}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 3 && serviceCategory !== 'holistic' && (
          <DateTimePicker
            date={date}
            timeSlot={timeSlot}
            setDate={setDate}
            setTimeSlot={setTimeSlot}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 4 && (
          <PersonalDetailsStep
            personalDetails={personalDetails}
            handlePersonalDetailsChange={handlePersonalDetailsChange}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {currentStep === 5 && (
          <ConfirmationStep
            date={date}
            serviceCategory={serviceCategory}
            selectedServices={selectedServices}
            timeSlot={timeSlot}
            timeframe={timeframe}
            personalDetails={personalDetails}
            prevStep={prevStep}
            handleConfirmBooking={handleConfirmBooking}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationBookingForm;
