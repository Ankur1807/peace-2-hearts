
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle2 } from 'lucide-react';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { referenceId } = location.state || {};

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
            Your booking has been successfully completed. 
            We appreciate your trust in Peace2Hearts.
          </p>
          
          {referenceId && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm">
                <strong>Reference ID:</strong> {referenceId}
              </p>
              <p className="text-sm mt-2">
                Please save this reference ID for future correspondence.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/payment-confirmation', { 
                state: location.state,
                replace: true
              })}
              className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
            >
              View Booking Details
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              className="w-full"
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
