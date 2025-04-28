import { useSearchParams, useLocation } from "react-router-dom";
import { usePaymentVerification } from "@/hooks/payment/usePaymentVerification";
import PaymentVerificationContent from "@/components/payment/verification/PaymentVerificationContent";
import PaymentVerificationLoader from "@/components/payment/verification/PaymentVerificationLoader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import PaymentProcessingLoader from "@/components/consultation/payment/PaymentProcessingLoader";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  const paymentId = searchParams.get("razorpay_payment_id") || location.state?.paymentId;
  const orderId = searchParams.get("razorpay_order_id") || location.state?.orderId;
  const signature = searchParams.get("razorpay_signature") || location.state?.signature;
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const amount = location.state?.amount || 0;
  const bookingDetails = location.state?.bookingDetails;

  const { isVerifying, verificationResult } = usePaymentVerification({
    paymentId,
    orderId,
    signature,
    amount,
    referenceId
  });

  useEffect(() => {
    if (location.state?.isVerifying) {
      const timer = setTimeout(() => {
        location.state.isVerifying = false;
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <SEO
        title="Payment Verification"
        description="Confirm your booking and payment details for your Peace2Hearts consultation."
        keywords="payment verification, booking confirmation, consultation payment"
      />
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {location.state?.isVerifying ? (
          <PaymentProcessingLoader />
        ) : (
          <PaymentVerificationContent
            verificationResult={verificationResult}
            paymentId={paymentId}
            orderId={orderId}
            amount={amount}
            referenceId={referenceId}
            bookingDetails={bookingDetails}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default PaymentVerification;
