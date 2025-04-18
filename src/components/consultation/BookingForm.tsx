
import React from 'react';
import { PersonalDetails } from '@/utils/types';
import ServiceSection from './form/ServiceSection';
import DateTimeSection from './form/DateTimeSection';
import PersonalDetailsFields from './PersonalDetailsFields';
import PricingSection from './form/PricingSection';
import DiscountSection from './form/DiscountSection';
import FormActions from './FormActions';
import { isFormValid } from './form/ValidationHelper';
import { Card } from '@/components/ui/card';

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
  
  // Discount related props
  discountCode?: string;
  setDiscountCode?: (code: string) => void;
  validateAndApplyDiscount?: () => Promise<boolean>;
  removeDiscount?: () => void;
  isValidatingDiscount?: boolean;
  appliedDiscountCode?: string | null;
  discountAmount?: number;
  originalPrice?: number;
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
  onSubmit,
  
  // Discount props with defaults
  discountCode = '',
  setDiscountCode = () => {},
  validateAndApplyDiscount = async () => false,
  removeDiscount = () => {},
  isValidatingDiscount = false,
  appliedDiscountCode = null,
  discountAmount = 0,
  originalPrice = totalPrice
}) => {
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className="space-y-8"
    >
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
      </div>
      
      {/* Price Summary Section */}
      <PricingSection
        selectedServices={selectedServices}
        pricing={pricing}
        totalPrice={totalPrice}
      />
      
      {/* Discount Section - New */}
      {selectedServices.length > 0 && (
        <DiscountSection
          discountCode={discountCode}
          setDiscountCode={setDiscountCode}
          validateAndApplyDiscount={validateAndApplyDiscount}
          removeDiscount={removeDiscount}
          isValidatingDiscount={isValidatingDiscount}
          appliedDiscountCode={appliedDiscountCode}
          discountAmount={discountAmount}
          originalPrice={originalPrice}
          totalPrice={totalPrice}
          selectedServices={selectedServices}
        />
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
      />
    </form>
  );
};

export default BookingForm;
