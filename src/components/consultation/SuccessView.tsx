
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
  referenceId?: string | null;
}

const SuccessView = ({ referenceId }: SuccessViewProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </div>
      
      <h1 className="text-3xl font-lora font-semibold mb-4">Booking Confirmed!</h1>
      
      <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto">
        Thank you for booking a consultation with Peace2Hearts. We have received your request and will reach out to you shortly to confirm your appointment.
      </p>
      
      {referenceId && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg inline-block">
          <p className="text-sm text-gray-500 mb-1">Your Booking Reference</p>
          <p className="text-lg font-medium">{referenceId}</p>
          <p className="text-xs text-gray-500 mt-1">Please save this for future reference</p>
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-gray-600">What happens next?</p>
        
        <ul className="space-y-2 text-gray-600 text-left max-w-md mx-auto">
          <li className="flex items-start gap-2">
            <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
            <span>You will receive a confirmation email with details of your booking.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
            <span>A day before your appointment, you will receive connection details for your video consultation.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 bg-peacefulBlue h-2 w-2 rounded-full flex-shrink-0"></span>
            <span>Please join 5 minutes before your scheduled time.</span>
          </li>
        </ul>
      </div>
      
      <div className="mt-10">
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessView;
