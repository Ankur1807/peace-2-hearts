
import React from 'react';
import SuccessView from './SuccessView';
import { BookingDetails } from '@/utils/types';

interface BookingSuccessViewProps {
  referenceId: string | null;
  bookingDetails: BookingDetails;
}

const BookingSuccessView: React.FC<BookingSuccessViewProps> = ({
  referenceId,
  bookingDetails
}) => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <SuccessView 
        referenceId={referenceId}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};

export default BookingSuccessView;
