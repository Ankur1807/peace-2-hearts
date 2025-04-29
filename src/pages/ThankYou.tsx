
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle2, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, referenceId } = location.state || {};

  // Redirect to home if no booking data
  useEffect(() => {
    if (!referenceId && !location.state) {
      navigate('/', { replace: true });
    }
  }, [referenceId, location.state, navigate]);

  // Format date nicely if available
  const formattedDate = bookingDetails?.date 
    ? new Date(bookingDetails.date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'To be scheduled';

  const serviceType = bookingDetails?.consultationType || 
                      (bookingDetails?.services && bookingDetails.services.length > 0 
                        ? bookingDetails.services.join(', ')
                        : 'Consultation');

  return (
    <>
      <SEO title="Thank You" description="Your booking has been confirmed" />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-lg bg-white/90">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-3xl font-semibold text-gray-800 mb-2">Thank You!</h1>
                <p className="text-lg text-gray-600">
                  Your booking has been confirmed and payment was successful.
                </p>
                {referenceId && (
                  <p className="mt-2 text-sm bg-gray-50 p-2 rounded inline-block">
                    Reference ID: <span className="font-semibold">{referenceId}</span>
                  </p>
                )}
              </div>

              {bookingDetails && (
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-peacefulBlue mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium">{serviceType}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-peacefulBlue mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{formattedDate}</p>
                      </div>
                    </div>

                    {(bookingDetails.timeSlot || bookingDetails.timeframe) && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-peacefulBlue mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">
                            {bookingDetails.timeSlot || bookingDetails.timeframe || 'To be confirmed'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  We've sent a confirmation email to {bookingDetails?.email || 'your email address'} with all the details.
                </p>
                <p className="mt-2 text-gray-700">
                  Our team will contact you shortly to confirm your appointment.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => navigate('/')}
                  className="bg-peacefulBlue hover:bg-peacefulBlue/90"
                >
                  Return to Homepage
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ThankYou;
