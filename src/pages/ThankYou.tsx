
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO 
        title="Thank You - Peace2Hearts"
        description="Thank you for your booking with Peace2Hearts."
      />
      <Navigation />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold font-lora mb-4">Thank You!</h1>
          <p className="text-lg text-gray-700 mb-8">
            Your booking has been received.
            You will receive an email shortly with the consultation details.
          </p>
          
          <div className="mt-8">
            <Button 
              onClick={() => navigate('/')}
              className="w-full max-w-sm bg-peacefulBlue hover:bg-peacefulBlue/90"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
