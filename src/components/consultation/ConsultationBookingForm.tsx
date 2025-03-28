
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import ServiceCategorySelector from './ServiceCategorySelector';
import ServiceSelectionOptions from './ServiceSelectionOptions';
import DateTimePicker from './DateTimePicker';
import TimeframeSelector from './TimeframeSelector';
import PersonalDetailsFields from './PersonalDetailsFields';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    date, 
    setDate,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    timeSlot,
    setTimeSlot,
    timeframe,
    setTimeframe,
    isProcessing,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking
  } = bookingState;

  const handlePersonalDetailsFieldChange = (field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };

  const handleServiceSelection = (serviceId: string, checked: boolean) => {
    if (checked) {
      if (serviceCategory === 'holistic' && selectedServices.length >= 4 && !selectedServices.includes(serviceId)) {
        return;
      }
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const handlePackageSelection = (packageId: string) => {
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSelectedServices(selectedPackage.services);
    }
  };

  useEffect(() => {
    setSelectedServices([]);
  }, [serviceCategory, setSelectedServices]);

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

  // These holisticPackages need to be defined here as well for handlePackageSelection
  const holisticPackages = [
    { 
      id: 'divorce-prevention', 
      label: 'Divorce Prevention Package', 
      description: '4 sessions (2 therapy + 1 mediation + 1 legal)',
      services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
    },
    { 
      id: 'pre-marriage-clarity', 
      label: 'Pre-Marriage Clarity Package', 
      description: '3 sessions (1 legal + 2 mental health)',
      services: ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'] 
    }
  ];

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-lora font-semibold mb-6">Book Your Consultation</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleConfirmBooking();
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
        
        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
            disabled={!isFormValid() || isProcessing}
          >
            {isProcessing ? "Processing..." : "Book Consultation"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ConsultationBookingForm;
