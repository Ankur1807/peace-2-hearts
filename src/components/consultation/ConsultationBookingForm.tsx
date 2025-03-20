
import React from 'react';
import { Card } from '@/components/ui/card';
import StepIndicator from '@/components/consultation/StepIndicator';
import ServiceSelectionStep from '@/components/consultation/ServiceSelectionStep';
import PersonalDetailsStep from '@/components/consultation/PersonalDetailsStep';
import PaymentStep from '@/components/consultation/PaymentStep';
import ConfirmationStep from '@/components/consultation/ConfirmationStep';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    date, 
    setDate,
    step,
    consultationType,
    setConsultationType,
    timeSlot,
    setTimeSlot,
    isProcessing,
    personalDetails,
    handleNextStep,
    handlePrevStep,
    handlePersonalDetailsChange,
    handleProcessPayment,
    handleConfirmBooking
  } = bookingState;

  const steps = [
    { number: 1, label: "Service" },
    { number: 2, label: "Details" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" }
  ];

  return (
    <>
      <StepIndicator currentStep={step} steps={steps} />

      <Card className="p-6 md:p-8">
        <form onSubmit={step === 3 ? handleProcessPayment : (e) => e.preventDefault()}>
          {step === 1 && (
            <ServiceSelectionStep 
              consultationType={consultationType}
              setConsultationType={setConsultationType}
              onNextStep={handleNextStep}
            />
          )}
          
          {step === 2 && (
            <PersonalDetailsStep
              date={date}
              setDate={setDate}
              timeSlot={timeSlot}
              setTimeSlot={setTimeSlot}
              personalDetails={personalDetails}
              onPersonalDetailsChange={handlePersonalDetailsChange}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
            />
          )}

          {step === 3 && (
            <PaymentStep
              consultationType={consultationType}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
              onSubmit={handleProcessPayment}
              isProcessing={isProcessing}
            />
          )}
          
          {step === 4 && (
            <ConfirmationStep
              consultationType={consultationType}
              date={date}
              timeSlot={timeSlot}
              personalDetails={personalDetails}
              onPrevStep={handlePrevStep}
              onConfirm={handleConfirmBooking}
            />
          )}
        </form>
      </Card>
    </>
  );
};

export default ConsultationBookingForm;
