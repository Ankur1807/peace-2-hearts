
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { getConsultationTypeLabel, getConsultationPrice, getTimeSlotLabel } from '@/utils/consultationLabels';
import { PersonalDetails } from '@/utils/types';

type ConfirmationStepProps = {
  consultationType: string;
  date: Date | undefined;
  timeSlot: string;
  personalDetails: PersonalDetails;
  onPrevStep: () => void;
  onConfirm: () => void;
};

const ConfirmationStep = ({
  consultationType,
  date,
  timeSlot,
  personalDetails,
  onPrevStep,
  onConfirm
}: ConfirmationStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-lora font-semibold mb-6">Confirm Your Booking</h2>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <div>
          <h3 className="text-gray-500 text-sm">Consultation Type</h3>
          <p className="font-medium">
            {getConsultationTypeLabel(consultationType)}
          </p>
        </div>

        <div>
          <h3 className="text-gray-500 text-sm">Client</h3>
          <p className="font-medium">{personalDetails.firstName} {personalDetails.lastName}</p>
          <p className="text-sm">{personalDetails.email}</p>
          <p className="text-sm">{personalDetails.phone}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-gray-500 text-sm">Date</h3>
            <p className="font-medium">{date ? format(date, "PPP") : 'Not selected'}</p>
          </div>
          
          <div>
            <h3 className="text-gray-500 text-sm">Time</h3>
            <p className="font-medium">
              {getTimeSlotLabel(timeSlot)}
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Duration</h3>
          <p className="font-medium">60 minutes</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 text-sm">Format</h3>
          <p className="font-medium">Video Call (link will be sent via email)</p>
        </div>

        <div>
          <h3 className="text-gray-500 text-sm">Payment</h3>
          <p className="font-medium">
            {getConsultationPrice(consultationType)} (Paid)
          </p>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-semibold mb-4">Consultation Details</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Your consultation will be conducted via secure video call.</li>
          <li>• You'll receive a confirmation email with connection details.</li>
          <li>• Please join 5 minutes before your scheduled time.</li>
          <li>• If you need to reschedule, please give 24 hours notice.</li>
        </ul>
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onConfirm}
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
        >
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
