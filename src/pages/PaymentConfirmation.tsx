
import { useSearchParams, useLocation } from "react-router-dom";
import BookingSuccessView from "@/components/consultation/BookingSuccessView";
import { BookingDetails } from "@/utils/types";

// Accept either query params or state for flexibility
const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // Try getting from state first (safer), fall back to search params
  const referenceId = location.state?.referenceId || searchParams.get("ref") || null;
  const bookingDetails: BookingDetails | undefined = location.state?.bookingDetails;

  if (!referenceId || !bookingDetails) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Booking Confirmed</h1>
        <p className="text-gray-700 mb-4">
          Your payment and booking are confirmed.
        </p>
        <p className="text-gray-500">
          Please check your email for further details!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BookingSuccessView
        referenceId={referenceId}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};

export default PaymentConfirmation;
