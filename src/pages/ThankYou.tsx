
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { BookingDetails } from '@/utils/types';
import { fetchConsultationData, createBookingDetailsFromConsultation } from '@/utils/consultation/consultationRecovery';
import BookingSuccessView from '@/components/consultation/BookingSuccessView';

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Extract referenceId from URL query parameters first, then from location state as fallback
  const referenceId = searchParams.get("ref") || location.state?.referenceId || null;
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | undefined>(
    location.state?.bookingDetails
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch booking details from Supabase using referenceId
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!referenceId) {
        console.log("No reference ID available to fetch booking data");
        return;
      }
      
      if (bookingDetails) {
        console.log("Booking details already available from state:", bookingDetails);
        return;
      }
      
      setIsLoading(true);
      setLoadingError(null);
      
      try {
        console.log(`Attempting to fetch booking data for reference ID: ${referenceId}`);
        const consultationData = await fetchConsultationData(referenceId);
        
        if (consultationData) {
          const details = createBookingDetailsFromConsultation(consultationData);
          setBookingDetails(details);
          console.log("Successfully retrieved booking details:", details);
        } else {
          setLoadingError("Unable to retrieve booking information. Please contact support.");
          console.error("Failed to retrieve consultation data for:", referenceId);
        }
      } catch (error) {
        setLoadingError("An error occurred while retrieving booking information");
        console.error("Error fetching booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookingData();
  }, [referenceId, bookingDetails]);

  if (isLoading) {
    return (
      <>
        <SEO 
          title="Loading - Peace2Hearts"
          description="Loading your booking information"
        />
        <Navigation />
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-peacefulBlue mb-4" />
          <h2 className="text-2xl font-semibold">Loading your booking information...</h2>
          <p className="text-gray-600 mt-2">Please wait while we retrieve your booking details.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Thank You - Peace2Hearts"
        description="Thank you for your booking with Peace2Hearts."
      />
      <Navigation />
      <div className="container mx-auto px-4 py-16 md:py-24">
        {bookingDetails ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h1 className="text-3xl md:text-4xl font-bold font-lora mb-4">Thank You!</h1>
              <p className="text-lg text-gray-700 mb-8">
                Your booking has been successfully completed. 
                We appreciate your trust in Peace2Hearts.
              </p>
            </div>
            
            <BookingSuccessView
              referenceId={referenceId}
              bookingDetails={bookingDetails}
            />
            
            <div className="mt-8 text-center">
              <Button 
                onClick={() => navigate('/')}
                variant="outline" 
                className="w-full max-w-sm"
              >
                Return to Home
              </Button>
            </div>
          </div>
        ) : (
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
            
            {loadingError && (
              <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-700">
                <p>{loadingError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <Button 
                onClick={() => {
                  const searchParams = new URLSearchParams();
                  if (referenceId) searchParams.set('ref', referenceId);
                  navigate(`/payment-confirmation?${searchParams.toString()}`, { 
                    state: {
                      referenceId,
                      ...location.state
                    },
                    replace: true
                  });
                }}
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
        )}
      </div>
      <Footer />
    </>
  );
};

export default ThankYou;
