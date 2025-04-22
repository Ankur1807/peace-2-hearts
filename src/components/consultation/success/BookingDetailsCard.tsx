
import { getServiceLabel } from '@/utils/consultationLabels';

interface BookingDetailsCardProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
  timeframe?: string;
  packageName?: string;
  isHolisticPackage: boolean;
}

const BookingDetailsCard = ({ 
  services, 
  date, 
  timeSlot, 
  timeframe,
  packageName,
  isHolisticPackage 
}: BookingDetailsCardProps) => {
  return (
    <div className="mb-8 max-w-lg mx-auto text-left">
      <h3 className="text-xl font-semibold mb-3">Booking Details:</h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        {isHolisticPackage && packageName ? (
          <>
            <p className="font-medium mb-2">Package Selected:</p>
            <p className="mb-4">{packageName}</p>
            <p className="font-medium mb-2">Preferred Timeframe:</p>
            <p>{timeframe}</p>
          </>
        ) : (
          <>
            <p className="font-medium mb-2">Services Selected:</p>
            <ul className="list-disc pl-5 mb-4">
              {services.map((service, index) => (
                <li key={index}>{getServiceLabel(service)}</li>
              ))}
            </ul>
            {date && (
              <>
                <p className="font-medium mb-2">Appointment Date:</p>
                <p className="mb-2">{date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</p>
              </>
            )}
            {timeSlot && (
              <>
                <p className="font-medium mb-2">Time:</p>
                <p>{timeSlot.replace('-', ':').toUpperCase()}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsCard;
