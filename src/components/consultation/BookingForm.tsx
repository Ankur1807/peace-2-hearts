
import React, { useState, useEffect } from 'react';
import { PersonalDetails } from '@/utils/types';
import ServiceSection from './form/ServiceSection';
import DateTimeSection from './form/DateTimeSection';
import PersonalDetailsFields from './PersonalDetailsFields';
import PricingSection from './form/PricingSection';
import FormActions from './FormActions';
import { isFormValid } from './form/ValidationHelper';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
  onSubmit: () => void;
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
  const [currentStep, setCurrentStep] = useState(1);
  
  useEffect(() => {
    if (selectedServices.length > 0 && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [selectedServices, currentStep]);

  useEffect(() => {
    if ((date && timeSlot) || (serviceCategory === 'holistic' && timeframe)) {
      if (currentStep === 2) setCurrentStep(3);
    }
  }, [date, timeSlot, timeframe, serviceCategory, currentStep]);

  const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleProceed = () => {
    console.log("handleProceed called in BookingForm");
    // Prevent default form submission - direct action
    onSubmit();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="bg-gradient-to-r from-peacefulBlue to-vividPink/20 p-4">
            <h3 className="text-xl font-semibold text-white">Select Your Services</h3>
          </div>
          <div className="p-6">
            <ServiceSection
              serviceCategory={serviceCategory}
              setServiceCategory={setServiceCategory}
              selectedServices={selectedServices}
              handleServiceSelection={handleServiceSelection}
              handlePackageSelection={handlePackageSelection}
              pricing={pricing}
            />
          </div>
        </Card>
        
        {currentStep >= 2 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInAnimation}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-peacefulBlue to-vividPink/20 p-4">
                <h3 className="text-xl font-semibold text-white">Choose Your Time</h3>
              </div>
              <div className="p-6">
                <DateTimeSection
                  serviceCategory={serviceCategory}
                  date={date}
                  setDate={setDate}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                />
              </div>
            </Card>
          </motion.div>
        )}
        
        {currentStep >= 3 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInAnimation}
          >
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-peacefulBlue to-vividPink/20 p-4">
                <h3 className="text-xl font-semibold text-white">Your Information</h3>
              </div>
              <div className="p-6">
                <PersonalDetailsFields 
                  personalDetails={personalDetails}
                  handlePersonalDetailsFieldChange={handlePersonalDetailsFieldChange}
                />
              </div>
            </Card>
          </motion.div>
        )}
      </div>
      
      {currentStep >= 3 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInAnimation}
        >
          <PricingSection
            selectedServices={selectedServices}
            pricing={pricing}
            totalPrice={totalPrice}
          />
        </motion.div>
      )}
      
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
        onProceed={handleProceed}
      />
    </div>
  );
};

export default BookingForm;
