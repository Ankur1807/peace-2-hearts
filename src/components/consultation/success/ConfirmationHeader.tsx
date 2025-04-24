
import { CheckCircle } from 'lucide-react';

const ConfirmationHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h1 className="text-3xl font-lora font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-700 text-lg">
        Thank you for choosing Peace2Hearts. Your consultation has been successfully booked.
      </p>
    </div>
  );
};

export default ConfirmationHeader;
