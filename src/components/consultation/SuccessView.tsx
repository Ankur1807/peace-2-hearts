
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessView = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center space-y-8">
      <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="section-title text-4xl md:text-5xl">Thank You!</h1>
      <p className="text-lg text-gray-600">
        Your consultation has been successfully scheduled. We've sent a confirmation email with all the details.
      </p>
      <p className="text-lg text-gray-600">
        If you have any questions before your appointment, please don't hesitate to contact us.
      </p>
      <div className="pt-6 flex gap-4 justify-center">
        <Button 
          className="bg-peacefulBlue hover:bg-peacefulBlue/90" 
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Return to Homepage
        </Button>
      </div>
    </div>
  );
};

export default SuccessView;
