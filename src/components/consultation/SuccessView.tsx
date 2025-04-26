
import { BookingDetails } from "@/utils/types";
import ConfirmationHeader from "./success/ConfirmationHeader";
import BookingReference from "./success/BookingReference";
import BookingDetailsCard from "./success/BookingDetailsCard";
import NextSteps from "./success/NextSteps";
import ActionButtons from "./success/ActionButtons";

interface SuccessViewProps {
  referenceId?: string | null;
  bookingDetails?: BookingDetails;
}

const SuccessView = ({ referenceId, bookingDetails }: SuccessViewProps) => {
  const isHolisticPackage = bookingDetails?.serviceCategory === 'holistic';

  return (
    <div className="space-y-6">
      <ConfirmationHeader />
      
      {referenceId && (
        <BookingReference referenceId={referenceId} />
      )}
      
      <BookingDetailsCard 
        services={bookingDetails?.services || []}
        date={bookingDetails?.date}
        timeSlot={bookingDetails?.timeSlot}
        timeframe={bookingDetails?.timeframe}
        packageName={bookingDetails?.packageName}
        isHolisticPackage={isHolisticPackage}
        amount={bookingDetails?.amount}
        referenceId={referenceId || undefined}
      />
      
      <NextSteps />
      
      <ActionButtons 
        bookingDetails={bookingDetails}
        referenceId={referenceId || ''}
      />
    </div>
  );
};

export default SuccessView;
