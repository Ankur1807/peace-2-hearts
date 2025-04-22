
import { CheckCircle2 } from "lucide-react";

const ConfirmationHeader = () => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-lora font-semibold mb-4">Booking Confirmed!</h1>
      
      <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
        Thank you for completing the payment and booking a consultation with Peace2Hearts. 
        We have received your request and will contact you shortly to confirm your appointment.
      </p>
    </>
  );
};

export default ConfirmationHeader;
