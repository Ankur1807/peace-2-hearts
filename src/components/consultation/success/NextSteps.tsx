
import { CalendarCheck, Mail, Phone } from 'lucide-react';

const NextSteps = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">What Happens Next?</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <Mail className="h-5 w-5 text-peacefulBlue mt-0.5" />
          <div>
            <h4 className="font-medium">Email Confirmation</h4>
            <p className="text-gray-600">You'll receive an email confirmation with these booking details shortly.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Phone className="h-5 w-5 text-peacefulBlue mt-0.5" /> 
          <div>
            <h4 className="font-medium">Consultant Assignment</h4>
            <p className="text-gray-600">Our team will review your request and assign the best-matched consultant for your needs.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <CalendarCheck className="h-5 w-5 text-peacefulBlue mt-0.5" />
          <div>
            <h4 className="font-medium">Scheduling</h4>
            <p className="text-gray-600">You'll be contacted within 24 hours to confirm the exact date and time for your consultation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
