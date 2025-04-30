
import React from 'react';
import { formatDate } from '@/utils/dateUtils';

interface BookingDetailsCardProps {
  services: string[];
  date?: string | Date;
  timeSlot?: string;
  timeframe?: string;
  packageName?: string | null;
  isHolisticPackage: boolean;
  amount?: number;
  referenceId?: string;
}

const BookingDetailsCard: React.FC<BookingDetailsCardProps> = ({
  services,
  date,
  timeSlot,
  timeframe,
  packageName,
  isHolisticPackage,
  amount,
  referenceId
}) => {
  // Format the date for display
  const formattedDate = date ? formatDate(date) : undefined;

  // Log for debugging timezone issues
  React.useEffect(() => {
    if (date) {
      console.log("[BookingDetailsCard] Raw date value:", date);
      console.log("[BookingDetailsCard] Date type:", typeof date);
      if (date instanceof Date) {
        console.log("[BookingDetailsCard] Date ISO string:", date.toISOString());
      } else if (typeof date === 'string') {
        console.log("[BookingDetailsCard] String date parsing:", new Date(date).toISOString());
      }
      console.log("[BookingDetailsCard] Formatted date:", formattedDate);
    }
  }, [date, formattedDate]);

  // Format the time slot for display
  const formattedTimeSlot = timeSlot ? 
    timeSlot.replace('-', ':').toUpperCase() : undefined;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
      
      <div className="space-y-4">
        {services && services.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700">Services</h4>
            <ul className="list-disc list-inside text-gray-600 ml-2">
              {services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        )}

        {(formattedDate || formattedTimeSlot || timeframe) && (
          <div>
            <h4 className="font-medium text-gray-700">Scheduling</h4>
            {formattedDate && (
              <p className="text-gray-600">Date: {formattedDate}</p>
            )}
            {formattedTimeSlot && (
              <p className="text-gray-600">Time: {formattedTimeSlot}</p>
            )}
            {timeframe && (
              <p className="text-gray-600">Timeframe: {timeframe}</p>
            )}
          </div>
        )}

        {amount && (
          <div>
            <h4 className="font-medium text-gray-700">Payment</h4>
            <p className="text-gray-600">Amount paid: ₹{amount}</p>
          </div>
        )}

        {referenceId && (
          <div>
            <h4 className="font-medium text-gray-700">Reference ID</h4>
            <p className="text-gray-600 font-mono">{referenceId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsCard;
