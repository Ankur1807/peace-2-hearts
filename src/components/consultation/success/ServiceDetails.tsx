
import { getServiceLabel } from '@/utils/consultationLabels';
import { formatDate } from '@/utils/formatUtils';

interface ServiceDetailsProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
}

const ServiceDetails = ({ services, date, timeSlot }: ServiceDetailsProps) => {
  // Filter out pre-marriage-legal service and any undefined/null services if present
  const displayServices = (services || []).filter(service => 
    service && 
    service !== 'pre-marriage-legal'
  );
  
  if (displayServices.length === 0) {
    return (
      <div className="py-2">
        <p className="text-amber-600">No service details available</p>
      </div>
    );
  }
  
  return (
    <>
      <p className="font-medium mb-2">Services Selected:</p>
      <ul className="list-disc pl-5 mb-4">
        {displayServices.map((service, index) => (
          <li key={index}>{getServiceLabel(service)}</li>
        ))}
      </ul>
      {date && (
        <>
          <p className="font-medium mb-2">Appointment Date:</p>
          <p className="mb-2">{date instanceof Date ? formatDate(date) : 'Date to be confirmed'}</p>
        </>
      )}
      {timeSlot && (
        <>
          <p className="font-medium mb-2">Time:</p>
          <p>{timeSlot.replace('-', ':').toUpperCase()}</p>
        </>
      )}
    </>
  );
};

export default ServiceDetails;
