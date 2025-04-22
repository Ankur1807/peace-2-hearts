
import PackageDetails from './PackageDetails';
import ServiceDetails from './ServiceDetails';

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
      </div>
    </div>
  );
};

export default BookingDetailsCard;
