
import React from 'react';
import DateTimePicker from '../DateTimePicker';
import TimeframeSelector from '../TimeframeSelector';
import { isSaturday, isSunday } from 'date-fns';

interface DateTimeSectionProps {
  serviceCategory: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  serviceCategory,
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  timeframe,
  setTimeframe
}) => {
  // Get the time slots based on service category
  const getAvailableTimeSlots = () => {
    // For legal consultations: 5 PM - 8 PM
    if (serviceCategory === 'legal') {
      return ['5-pm', '6-pm', '7-pm', '8-pm'];
    }
    // For mental health: 11 AM - 8 PM
    else if (serviceCategory === 'mental-health') {
      return ['11-am', '12-pm', '1-pm', '2-pm', '3-pm', '4-pm', '5-pm', '6-pm', '7-pm', '8-pm'];
    }
    // Default time slots
    return ['9-am', '10-am', '11-am', '12-pm', '1-pm', '2-pm', '3-pm', '4-pm', '5-pm', '6-pm', '7-pm', '8-pm'];
  };

  // Calculate minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    if (serviceCategory === 'legal') {
      // Only allow Saturdays and Sundays for legal consultations
      return !(isSaturday(date) || isSunday(date));
    }
    // For other services, only disable past dates
    return date < getMinDate();
  };

  // Create a wrapped setDate function to add additional logging
  const handleDateChange = (newDate: Date | undefined) => {
    console.log('[DateTimeSection] Setting new date:', newDate);
    if (newDate) {
      console.log('[DateTimeSection] New date ISO string:', newDate.toISOString());
      console.log('[DateTimeSection] New date formatted:', newDate.toLocaleDateString());
      console.log('[DateTimeSection] Year:', newDate.getFullYear());
      console.log('[DateTimeSection] Month:', newDate.getMonth() + 1);
      console.log('[DateTimeSection] Day:', newDate.getDate());
      
      // Set the date directly without further manipulation
      // The DateTimePicker has already adjusted the time to noon to prevent timezone issues
      setDate(newDate);
    } else {
      setDate(newDate);
    }
  };

  // Log for debugging timezone issues
  React.useEffect(() => {
    if (date) {
      console.log("[DateTimeSection] Selected date object:", date);
      console.log("[DateTimeSection] Date in ISO:", date.toISOString());
      console.log("[DateTimeSection] Local date string:", date.toString());
      console.log("[DateTimeSection] Full year:", date.getFullYear());
      console.log("[DateTimeSection] Month:", date.getMonth() + 1);
      console.log("[DateTimeSection] Date:", date.getDate());
      console.log("[DateTimeSection] Local time:", date.toLocaleTimeString());
      console.log("[DateTimeSection] Selected time slot:", timeSlot);
      
      // Calculate the UTC offset
      const offset = date.getTimezoneOffset();
      console.log("[DateTimeSection] Timezone offset (minutes):", offset);
      console.log("[DateTimeSection] Timezone offset (hours):", offset / 60);
    }
  }, [date, timeSlot]);

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Schedule Your Session</h3>
      
      {serviceCategory === 'holistic' ? (
        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      ) : (
        <DateTimePicker 
          date={date}
          setDate={handleDateChange}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
          serviceCategory={serviceCategory}
          availableTimeSlots={getAvailableTimeSlots()}
          minDate={getMinDate()}
          isDateDisabled={isDateDisabled}
        />
      )}
    </div>
  );
};

export default DateTimeSection;
