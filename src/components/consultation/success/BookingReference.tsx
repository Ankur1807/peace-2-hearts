
import React from 'react';

interface BookingReferenceProps {
  referenceId: string;
}

const BookingReference: React.FC<BookingReferenceProps> = ({ referenceId }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Booking Reference</h3>
          <p className="font-mono text-lg font-bold">{referenceId}</p>
        </div>
        <div className="mt-3 sm:mt-0">
          <p className="text-sm text-gray-500">Please save this reference ID</p>
        </div>
      </div>
    </div>
  );
};

export default BookingReference;
