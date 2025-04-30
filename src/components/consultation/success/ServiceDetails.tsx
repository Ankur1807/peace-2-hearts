
import { getServiceLabel } from '@/utils/consultationLabels';
import { formatDate } from '@/utils/formatUtils';

interface ServiceDetailsProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
}

const ServiceDetails = ({ services, date, timeSlot }: ServiceDetailsProps) => {
  // Log for debugging timezone issues
  if (date) {
    console.log("[ServiceDetails] Raw date value:", date);
    console.log("[ServiceDetails] Date type:", typeof date);
    if (date instanceof Date) {
      console.log("[ServiceDetails] Date ISO string:", date.toISOString());
    }
  }

  return (
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
