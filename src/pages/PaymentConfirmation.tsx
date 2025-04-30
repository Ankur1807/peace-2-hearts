
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { BookingDetails } from "@/utils/types";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { usePaymentRecovery } from "@/hooks/consultation/usePaymentRecovery";
import { usePaymentConfirmation } from "@/hooks/payment/usePaymentConfirmation";
import PaymentProcessing from "@/components/payment/confirmation/PaymentProcessing";
import PaymentConfirmationContainer from "@/components/payment/confirmation/PaymentConfirmationContainer";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { fetchConsultationData, createBookingDetailsFromConsultation } from "@/utils/consultation/consultationRecovery";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract payment information from URL params first, then location state as fallback
  const referenceId = searchParams.get("ref") || location.state?.referenceId || null;
  const paymentId = searchParams.get("pid") || location.state?.paymentId || null;
  const orderId = location.state?.orderId || null;
  const amount = location.state?.amount || 0;
  const paymentFailed = location.state?.paymentFailed || false;
  const verificationFailed = location.state?.verificationFailed || false;
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | undefined>(
    location.state?.bookingDetails
  );
  const [bookingRecovered, setBookingRecovered] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { isRecovering, recoveryResult, recoverPaymentAndSendEmail } = usePaymentRecovery();
  
  const { isVerifying, setIsVerifying, verificationResult } = usePaymentConfirmation({
    referenceId,
    paymentId,
    orderId,
    amount,
    paymentFailed,
    verificationFailed,
    setBookingRecovered
  });

  // Always try to fetch booking data from Supabase if we have a reference ID
  useEffect(() => {
    const fetchBookingData = async () => {
      if (referenceId && !bookingDetails) {
        setIsFetching(true);
        try {
          console.log("Fetching booking data from Supabase for reference ID:", referenceId);
          
          // Fetch consultation data directly from Supabase
          const { data: consultation, error } = await supabase
            .from('consultations')
            .select('*')
            .eq('reference_id', referenceId)
            .single();
            
          if (error) {
            console.error("Error fetching consultation data:", error);
            return;
          }
          
          if (consultation) {
            // Convert the consultation data to BookingDetails format
            const recoveredBookingDetails: BookingDetails = {
              clientName: consultation.client_name || '',
              email: consultation.client_email || '',
              phone: consultation.client_phone || '',
              referenceId: consultation.reference_id || '',
              consultationType: consultation.consultation_type || '',
              services: consultation.consultation_type ? [consultation.consultation_type] : [],
              date: consultation.date ? new Date(consultation.date) : undefined,
              timeSlot: consultation.time_slot || '',
              timeframe: consultation.timeframe || '',
              serviceCategory: consultation.service_category || '',
              message: consultation.message || '',
              amount: consultation.amount ? Number(consultation.amount) : undefined,
              paymentId: consultation.payment_id || undefined
            };
            
            setBookingDetails(recoveredBookingDetails);
            setBookingRecovered(true);
            
            console.log("Booking details recovered from Supabase:", recoveredBookingDetails);
            
            toast({
              title: "Booking Details Found",
              description: "We've successfully retrieved your booking information."
            });
          } else {
            console.log("No consultation data found for reference ID:", referenceId);
          }
        } catch (error) {
          console.error("Error in booking data recovery:", error);
        } finally {
          setIsFetching(false);
        }
      }
    };
    
    fetchBookingData();
  }, [referenceId, toast]);

  // Handle manual recovery attempt
  const handleManualRecovery = async () => {
    if (referenceId && paymentId && amount > 0) {
      console.log("Manual recovery requested for:", { referenceId, paymentId, amount });
      await recoverPaymentAndSendEmail(referenceId, paymentId, amount, orderId);
    } else {
      console.error("Missing required information for recovery:", { referenceId, paymentId, amount });
      toast({
        title: "Recovery Failed",
        description: "Missing required information for recovery",
        variant: "destructive"
      });
    }
  };

  if (isVerifying || isRecovering || isFetching) {
    return (
      <>
        <SEO title="Processing Booking" description="Verifying your booking details" />
        <Navigation />
        <PaymentProcessing 
          isVerifying={isVerifying} 
          isRecovering={isRecovering || isFetching} 
        />
        <Footer />
      </>
    );
  }

  if (!referenceId && !paymentId) {
    return (
      <>
        <SEO title="Booking Confirmation" description="Your booking confirmation details" />
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Booking Information Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find any booking information. Please check your email for confirmation details or contact support.
          </p>
          <Button onClick={() => navigate('/')} className="bg-peacefulBlue hover:bg-peacefulBlue/80">
            Return to Home
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Payment Confirmation"
        description="Confirm your booking and payment details for your Peace2Hearts consultation."
        keywords="payment confirmation, booking confirmation, consultation payment"
      />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {referenceId && !bookingDetails ? (
          <div className="text-center py-10">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">We are finalizing your booking...</h2>
              <p className="mb-4 text-gray-600">
                Your payment has been received and your booking is being processed.
              </p>
              {referenceId && (
                <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
                  <p className="font-medium">Reference ID: <span className="font-normal">{referenceId}</span></p>
                  {paymentId && <p className="font-medium">Payment ID: <span className="font-normal">{paymentId}</span></p>}
                </div>
              )}
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-peacefulBlue hover:bg-peacefulBlue/90"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        ) : verificationResult ? (
          <PaymentConfirmationContainer
            verificationResult={verificationResult}
            paymentId={paymentId}
            orderId={orderId}
            amount={amount}
            referenceId={referenceId}
            bookingDetails={bookingDetails}
            bookingRecovered={bookingRecovered}
            recoveryResult={recoveryResult}
            onManualRecovery={handleManualRecovery}
          />
        ) : bookingDetails ? (
          <BookingSuccessView
            referenceId={referenceId}
            bookingDetails={bookingDetails}
          />
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Booking Confirmation</h1>
            <p className="text-gray-700 mb-4">
              We received your booking request, but we couldn't find complete details.
            </p>
            {referenceId && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 text-left w-full max-w-md">
                <p className="font-medium">Reference ID: <span className="font-normal">{referenceId}</span></p>
                {paymentId && <p className="font-medium">Payment ID: <span className="font-normal">{paymentId}</span></p>}
              </div>
            )}
            <Button className="mt-6" onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default PaymentConfirmation;
