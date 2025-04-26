
import React from 'react';
import SuccessView from './SuccessView';
import { BookingDetails } from '@/utils/types';
import { Card } from '@/components/ui/card';

interface BookingSuccessViewProps {
  referenceId: string | null;
  bookingDetails: BookingDetails;
}

const BookingSuccessView: React.FC<BookingSuccessViewProps> = ({
  referenceId,
  bookingDetails
}) => {
  return (
    <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-md">
      <SuccessView 
        referenceId={referenceId}
        bookingDetails={bookingDetails}
      />
    </Card>
  );
};

export default BookingSuccessView;
