
import React from 'react';

interface BookingErrorAlertProps {
  error: string | null;
}
const BookingErrorAlert: React.FC<BookingErrorAlertProps> = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
      <p className="font-medium">Error: {error}</p>
    </div>
  );
};
export default BookingErrorAlert;
