
import PackageDetails from './PackageDetails';
import ServiceDetails from './ServiceDetails';
import { formatPrice } from '@/utils/pricing';

interface BookingDetailsCardProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
  timeframe?: string;
  packageName?: string;
  isHolisticPackage: boolean;
  amount?: number;
  referenceId?: string;
}

const BookingDetailsCard = ({ 
  services, 
  date, 
  timeSlot, 
  timeframe,
  packageName,
  isHolisticPackage,
  amount,
  referenceId
}: BookingDetailsCardProps) => {
  return (
    <div className="mb-8 max-w-lg mx-auto text-left">
      <h3 className="text-xl font-semibold mb-3">Booking Details:</h3>
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        {referenceId && (
          <div className="mb-4">
            <p className="font-medium mb-1">Reference ID:</p>
            <p className="bg-white px-3 py-2 rounded border border-gray-200 font-mono text-sm">
              {referenceId}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Please save this ID for future reference
            </p>
          </div>
        )}
        
        {isHolisticPackage && packageName && timeframe ? (
          <PackageDetails 
            packageName={packageName} 
            timeframe={timeframe} 
          />
        ) : (
          <ServiceDetails 
            services={services}
            date={date}
            timeSlot={timeSlot}
          />
        )}
        
        {amount !== undefined && amount > 0 && (
          <div className="border-t pt-4 mt-4">
            <p className="font-medium mb-2">Payment Amount:</p>
            <p className="text-green-700 font-semibold">{formatPrice(amount)} (Paid)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsCard;
