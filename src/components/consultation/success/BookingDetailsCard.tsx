
import { formatDate } from '@/utils/dateFormatters';

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
  const formattedDate = date ? formatDate(date) : undefined;

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

        {(formattedDate || timeSlot || timeframe) && (
          <div>
            <h4 className="font-medium text-gray-700">Scheduling</h4>
            {formattedDate && (
              <p className="text-gray-600">Date: {formattedDate}</p>
            )}
            {timeSlot && (
              <p className="text-gray-600">Time: {timeSlot}</p>
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
