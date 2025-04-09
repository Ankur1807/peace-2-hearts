
import React from 'react';
import DateTimePicker from '../DateTimePicker';
import TimeframeSelector from '../TimeframeSelector';

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
  return (
    <>
      {serviceCategory === 'holistic' ? (
        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
        />
      ) : (
        <DateTimePicker 
          date={date}
          setDate={setDate}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
        />
      )}
    </>
  );
};

export default DateTimeSection;
