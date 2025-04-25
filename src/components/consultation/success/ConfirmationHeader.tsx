
import { CheckCircle } from 'lucide-react';

const ConfirmationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-lora font-bold mb-2">Thank You for Booking Your Consultation with Peace2Hearts!</h1>
      <p className="text-gray-700 text-lg">
        Your consultation booking and payment have been successfully received.
      </p>
      <p className="text-gray-700 mt-2">
        We will now match you with the best consultant based on your request and schedule your consultation slot.
      </p>
    </div>
  );
};

export default ConfirmationHeader;
