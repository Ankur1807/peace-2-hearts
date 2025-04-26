import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";
import { verifyAndSyncPayment, savePaymentRecord } from "@/utils/payment/razorpayService";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePaymentRecovery } from "@/hooks/consultation/usePaymentRecovery";
import { supabase } from "@/integrations/supabase/client";

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  const orderId = searchParams.get("razorpay_order_id") || location.state?.orderId;
  const amount = location.state?.amount || 0;
  const paymentFailed = location.state?.paymentFailed || false;
  const verificationFailed = location.state?.verificationFailed || false;
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{success: boolean; message: string} | null>(null);
  const [bookingRecovered, setBookingRecovered] = useState(false);
  const { isRecovering, recoveryResult, recoverPaymentAndSendEmail } = usePaymentRecovery();

  useEffect(() => {
    console.log("Payment Confirmation Page loaded with:", { 
      referenceId, 
      paymentId, 
      orderId, 
      amount,
      hasBookingDetails: !!bookingDetails,
      paymentFailed,
      verificationFailed
    });
  }, [referenceId, paymentId, orderId, amount, bookingDetails, paymentFailed, verificationFailed]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId && !verificationResult) {
        setIsVerifying(true);
        try {
          const verified = await verifyAndSyncPayment(paymentId);
          
          if (verified) {
            if (referenceId && amount > 0) {
              try {
                console.log("Attempting to save payment record with reference ID:", referenceId);
                
                const paymentSaved = await savePaymentRecord({
                  paymentId,
                  orderId: orderId || '',
                  amount,
                  referenceId,
                  status: 'completed'
                });
                
                if (paymentSaved) {
                  setBookingRecovered(true);
                  toast({
                    title: "Payment Record Saved",
                    description: "Your payment record has been successfully saved."
                  });
                } else {
                  console.error("Failed to save payment record for referenceId:", referenceId);
                  await recoverPaymentAndSendEmail(referenceId, paymentId, amount, orderId);
                }
              } catch (error) {
                console.error("Error saving payment record:", error);
                await recoverPaymentAndSendEmail(referenceId, paymentId, amount, orderId);
              }
            }
            
            setVerificationResult({
              success: true,
              message: "Your payment has been verified and your booking is confirmed."
            });
          } else {
            setVerificationResult({
              success: false,
              message: "We could not verify your payment. Please contact support with your payment ID."
            });
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          setVerificationResult({
            success: false,
            message: "An error occurred while verifying your payment. Please contact support."
          });
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    verifyPayment();
  }, [paymentId, orderId, referenceId, amount, verificationResult, toast, recoverPaymentAndSendEmail]);

  useEffect(() => {
    if (paymentFailed) {
      setVerificationResult({
        success: false,
        message: "Your payment was not completed. Please try again or contact support."
      });
    } else if (verificationFailed) {
      setVerificationResult({
        success: false,
        message: "We couldn't verify your payment. Please contact our support team."
      });
    }
  }, [paymentFailed, verificationFailed]);

  useEffect(() => {
    const recoverBookingData = async () => {
      if (referenceId && !bookingDetails) {
        setIsVerifying(true);
        try {
          console.log("Attempting to recover booking data for reference ID:", referenceId);
          const consultationData = await fetchConsultationData(referenceId);
          
          if (consultationData) {
            console.log("Successfully recovered consultation data:", consultationData);
            const recoveredBookingDetails = createBookingDetailsFromConsultation(consultationData);
            
            if (recoveredBookingDetails) {
              console.log("Created booking details from recovered data:", recoveredBookingDetails);
              setBookingRecovered(true);
              
              navigate(".", { 
                state: {
                  ...location.state,
                  bookingDetails: recoveredBookingDetails
                },
                replace: true
              });
              
              toast({
                title: "Booking Details Recovered",
                description: "We've successfully retrieved your booking information."
              });
            }
          } else {
            console.error("No consultation data found for reference ID:", referenceId);
            
            const { data: allConsultations } = await supabase
              .from('consultations')
              .select('reference_id, client_name, status')
              .order('created_at', { ascending: false })
              .limit(5);
              
            console.log("Recent consultations:", allConsultations);
          }
        } catch (error) {
          console.error("Error in booking data recovery:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };
    
    recoverBookingData();
  }, [referenceId, bookingDetails, toast, navigate, location.state]);

  const handleManualRecovery = async () => {
    if (referenceId && paymentId && amount > 0) {
      await recoverPaymentAndSendEmail(referenceId, paymentId, amount, orderId);
    } else {
      toast({
        title: "Recovery Failed",
        description: "Missing required information for recovery",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEO
        title="Payment Confirmation"
        description="Confirm your booking and payment details for your Peace2Hearts consultation."
        keywords="payment confirmation, booking confirmation, consultation payment"
      />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {isVerifying || isRecovering ? (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              {isVerifying ? "Verifying Your Payment" : "Recovering Your Booking"}
            </h1>
            <p className="text-gray-700">
              {isVerifying 
                ? "Please wait while we verify your payment details..." 
                : "Please wait while we recover your booking information..."}
            </p>
          </div>
        ) : verificationResult ? (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <Card className="p-8 mb-6">
              <Alert variant={verificationResult.success ? "default" : "destructive"} className="mb-6">
                <AlertTitle className="text-xl font-lora">{verificationResult.success ? "Payment Verified" : "Verification Issue"}</AlertTitle>
                <AlertDescription className="text-lg">{verificationResult.message}</AlertDescription>
              </Alert>
              
              {verificationResult.success ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold font-lora">Payment Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-gray-500 text-sm">Payment ID</p>
                        <p className="font-medium">{paymentId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Order ID</p>
                        <p className="font-medium">{orderId || "N/A"}</p>
                      </div>
                      {amount > 0 && (
                        <div>
                          <p className="text-gray-500 text-sm">Amount Paid</p>
                          <p className="font-medium">₹{amount}</p>
                        </div>
                      )}
                      {referenceId && (
                        <div>
                          <p className="text-gray-500 text-sm">Reference ID</p>
                          <p className="font-medium">{referenceId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {recoveryResult && (
                    <Alert variant={recoveryResult.success ? "default" : "destructive"} className="my-4">
                      <AlertTitle>{recoveryResult.success ? "Recovery Successful" : "Recovery Issue"}</AlertTitle>
                      <AlertDescription>{recoveryResult.message}</AlertDescription>
                    </Alert>
                  )}
                  
                  {bookingDetails ? (
                    <BookingSuccessView
                      referenceId={referenceId}
                      bookingDetails={bookingDetails}
                    />
                  ) : (
                    <div className="text-center py-6">
                      <p className="mb-4">Your payment has been successfully processed.</p>
                      {bookingRecovered ? (
                        <p className="mb-6 text-green-600">
                          Your booking record has been successfully recovered.
                        </p>
                      ) : (
                        <>
                          <p className="mb-6 text-amber-600">
                            We couldn't find complete booking details, but your payment has been recorded. 
                            {!recoveryResult && " You may not have received a confirmation email yet."}
                          </p>
                          {!recoveryResult && (
                            <Button 
                              onClick={handleManualRecovery} 
                              className="mb-6 bg-peacefulBlue hover:bg-peacefulBlue/90"
                            >
                              Resend Confirmation Email
                            </Button>
                          )}
                        </>
                      )}
                      <Button onClick={() => navigate('/')}>Return to Home</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-6 text-center">
                  <p className="mb-4">Payment ID: <strong>{paymentId}</strong></p>
                  <p className="mb-4">Order ID: <strong>{orderId || "N/A"}</strong></p>
                  <p className="mb-6">Please save these details for your reference when contacting support.</p>
                  <div className="space-y-3">
                    <Button onClick={() => navigate('/book-consultation')} className="w-full sm:w-auto">
                      Try Booking Again
                    </Button>
                    <div className="pt-2">
                      <Button onClick={() => navigate('/')} variant="outline" className="w-full sm:w-auto">
                        Return to Home
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (!referenceId && !bookingDetails && !paymentId) ? (
          <div className="flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">Booking Confirmation</h1>
            <p className="text-gray-700 mb-4">
              We received your booking request, but we couldn't find complete details.
            </p>
            <p className="text-gray-700 mb-4">
              If you've made a payment, it should be processed shortly.
            </p>
            <p className="text-gray-500">
              Please check your email for further details!
            </p>
            <Button className="mt-6" onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        ) : (
          <BookingSuccessView
            referenceId={referenceId}
            bookingDetails={bookingDetails}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

const fetchConsultationData = async (referenceId: string): Promise<any> => {
  if (!referenceId) return null;
  
  console.log("Attempting to fetch consultation data for reference ID:", referenceId);
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, payments(*)')
      .eq('reference_id', referenceId)
      .single();
    
    if (error) {
      console.error("Error fetching consultation data:", error);
      
      const { data: similarData, error: searchError } = await supabase
        .from('consultations')
        .select('reference_id, client_name, status')
        .ilike('reference_id', `%${referenceId.slice(-6)}%`)
        .limit(5);
        
      if (!searchError && similarData && similarData.length > 0) {
        console.log("Found similar reference IDs:", similarData);
      }
      
      return null;
    }
    
    console.log("Successfully retrieved consultation data:", data);
    return data;
  } catch (error) {
    console.error("Exception fetching consultation data:", error);
    return null;
  }
};

const createBookingDetailsFromConsultation = (consultation: any): BookingDetails | null => {
  if (!consultation) return null;
  
  try {
    let bookingDate: Date | undefined = undefined;
    if (consultation.date) {
      try {
        bookingDate = new Date(consultation.date);
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }
    
    let amount = 0;
    if (consultation.payments && consultation.payments.length > 0) {
      amount = consultation.payments[0].amount;
    }
    
    const services = consultation.consultation_type ? 
      [consultation.consultation_type] : [];
    
    return {
      clientName: consultation.client_name || '',
      email: consultation.client_email || '',
      referenceId: consultation.reference_id || '',
      consultationType: consultation.consultation_type || '',
      services: services,
      date: bookingDate,
      timeSlot: consultation.time_slot || undefined,
      timeframe: consultation.timeframe || undefined,
      message: consultation.message || '',
      amount: amount,
      serviceCategory: getServiceCategoryFromConsultationType(consultation.consultation_type)
    };
  } catch (error) {
    console.error("Error creating booking details from consultation:", error);
    return null;
  }
};

const getServiceCategoryFromConsultationType = (type: string): string => {
  if (!type) return '';
  
  if (type.includes('holistic') || 
      type.includes('divorce-prevention') || 
      type.includes('pre-marriage-clarity')) {
    return 'holistic';
  }
  
  if (type.includes('legal') || 
      type.includes('divorce') || 
      type.includes('custody')) {
    return 'legal';
  }
  
  if (type.includes('psychological') || 
      type.includes('therapy') || 
      type.includes('counseling')) {
    return 'psychological';
  }
  
  return '';
};

export default PaymentConfirmation;
