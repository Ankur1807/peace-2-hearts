
import { getServiceLabel } from '@/utils/consultationLabels';
import { formatDate } from '@/utils/formatUtils';

interface ServiceDetailsProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
}

const ServiceDetails = ({ services, date, timeSlot }: ServiceDetailsProps) => {
  // Filter out pre-marriage-legal service if present
  const displayServices = services.filter(service => service !== 'pre-marriage-legal');
  
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
