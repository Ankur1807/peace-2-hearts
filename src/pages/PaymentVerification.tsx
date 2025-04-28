
import { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { verifyRazorpayPayment, verifyAndSyncPayment } from "@/utils/payment/razorpayService";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaymentErrorMessage from "@/components/consultation/payment/PaymentErrorMessage";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get payment details from URL params or location state
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  const orderId = searchParams.get("razorpay_order_id") || location.state?.orderId;
  const signature = searchParams.get("razorpay_signature") || location.state?.signature;
  const amount = location.state?.amount || 0;
  const receiptId = location.state?.receiptId || "";
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Retry verification logic for QR code/UPI payments
  const handleRetryVerification = async () => {
    if (paymentId) {
      setIsRetrying(true);
      
      try {
        console.log(`Retry ${retryCount + 1}: Re-verifying payment: ${paymentId}`);
        // Use direct verification against Razorpay API
        const verified = await verifyAndSyncPayment(paymentId);
        
        if (verified) {
          setIsVerified(true);
          setError(null);
          
          toast({
            title: "Payment Verified",
            description: "Your payment has been successfully verified on retry.",
          });
          
          // Redirect to the confirmation page
          setTimeout(() => {
            navigate("/payment-confirmation", {
              state: {
                paymentId,
                orderId,
                amount,
                referenceId: receiptId,
                recoveryAttempted: true
              }
            });
          }, 1500);
        } else {
          // Still failed after retry
          setError(`Verification still failed after retry ${retryCount + 1}. Payment may still be processing.`);
        }
      } catch (error: any) {
        console.error(`Retry ${retryCount + 1} error:`, error);
        setError(`Error during retry: ${error.message}`);
      } finally {
        setIsRetrying(false);
        setRetryCount(prev => prev + 1);
      }
    }
  };
  
  // Verify payment on component mount
  useEffect(() => {
    const verifyPayment = async () => {
      if (paymentId && orderId && signature) {
        setIsVerifying(true);
        
        try {
          console.log("Verifying payment:", { paymentId, orderId });
          const verified = await verifyRazorpayPayment({
            paymentId,
            orderId,
            signature
          });
          
          console.log("Payment verification result:", verified);
          setIsVerified(verified);
          
          if (verified) {
            toast({
              title: "Payment Verified",
              description: "Your payment has been successfully verified.",
            });
            
            // Automatically redirect to the confirmation page
            setTimeout(() => {
              navigate("/payment-confirmation", {
                state: {
                  paymentId,
                  orderId,
                  amount,
                  referenceId: receiptId
                }
              });
            }, 1500);
          } else {
            // Check if payment is valid directly with Razorpay (might be a QR code payment)
            try {
              console.log("Attempting direct payment verification with Razorpay API");
              const directVerified = await verifyAndSyncPayment(paymentId);
              
              if (directVerified) {
                setIsVerified(true);
                
                toast({
                  title: "Payment Verified",
                  description: "Your payment was verified directly with Razorpay.",
                });
                
                // Redirect to confirmation
                setTimeout(() => {
                  navigate("/payment-confirmation", {
                    state: {
                      paymentId,
                      orderId,
                      amount,
                      referenceId: receiptId,
                      altVerification: true
                    }
                  });
                }, 1500);
              } else {
                setError("We couldn't verify your payment. If you paid via QR code, the payment may take a few minutes to process.");
              }
            } catch (directError: any) {
              console.error("Direct verification error:", directError);
              setError("Payment verification failed. If you've already paid, please contact support with your payment ID.");
            }
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          setError(error.message || "An error occurred during payment verification");
        } finally {
          setIsVerifying(false);
        }
      } else {
        setError("Missing payment information. Please try again or contact support.");
        setIsVerifying(false);
      }
    };
    
    verifyPayment();
  }, [paymentId, orderId, signature, navigate, toast, amount, receiptId]);

  return (
    <>
      <SEO
        title="Verifying Payment"
        description="We are verifying your payment. Please wait."
        keywords="payment verification, processing payment, payment confirmation"
      />
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Payment Verification</h1>
          
          {isVerifying && (
            <div className="flex flex-col items-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-peacefulBlue" />
              <p className="text-lg text-gray-700">Verifying your payment...</p>
            </div>
          )}
          
          {!isVerifying && isVerified && (
            <div className="text-center py-8">
              <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your payment has been successfully verified.</p>
              <p className="text-sm text-gray-500 mb-4">Payment ID: {paymentId}</p>
              <p className="text-sm text-gray-500 mb-6">Order ID: {orderId}</p>
              <p className="text-gray-600 mb-8">Redirecting to confirmation page...</p>
            </div>
          )}
          
          {!isVerifying && !isVerified && (
            <div className="text-center py-8">
              <div className="mb-4 mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Verification Issue</h2>
              
              <PaymentErrorMessage 
                message={error || "Verification failed"} 
                details="If you paid with UPI or QR code, the payment might still be processing."
                paymentId={paymentId || undefined}
                orderId={orderId || undefined}
              />
              
              <div className="mt-6 space-y-4">
                {paymentId && retryCount < 3 && (
                  <Button
                    onClick={handleRetryVerification}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    disabled={isRetrying}
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      `Retry Verification${retryCount > 0 ? ` (${retryCount + 1}/3)` : ''}`
                    )}
                  </Button>
                )}
                
                <div className="flex flex-col space-y-4">
                  <Button 
                    className="bg-peacefulBlue hover:bg-peacefulBlue/90" 
                    onClick={() => navigate("/payment-confirmation", {
                      state: {
                        paymentId,
                        orderId,
                        amount,
                        referenceId: receiptId,
                        verificationFailed: true
                      }
                    })}
                  >
                    Continue to Confirmation
                  </Button>
                  
                  <Button 
                    className="bg-peacefulBlue hover:bg-peacefulBlue/90" 
                    onClick={() => navigate("/book-consultation")}
                  >
                    Return to Booking
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                  >
                    Go to Homepage
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PaymentVerification;
