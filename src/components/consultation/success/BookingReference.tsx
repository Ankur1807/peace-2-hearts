
interface BookingReferenceProps {
  referenceId: string;
}

const BookingReference = ({ referenceId }: BookingReferenceProps) => {
  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg inline-block">
      <p className="text-sm text-gray-500 mb-1">Your Booking Reference</p>
      <p className="text-lg font-medium">{referenceId}</p>
      <p className="text-xs text-gray-500 mt-1">Please save this for future reference</p>
    </div>
  );
};

export default BookingReference;
