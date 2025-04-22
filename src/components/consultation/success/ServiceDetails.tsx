
import { getServiceLabel } from '@/utils/consultationLabels';

interface ServiceDetailsProps {
  services: string[];
  date?: Date;
  timeSlot?: string;
}

const ServiceDetails = ({ services, date, timeSlot }: ServiceDetailsProps) => {
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
  );
};

export default ServiceDetails;
