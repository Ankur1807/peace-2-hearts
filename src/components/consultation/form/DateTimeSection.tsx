
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
          setDate={setDate}
          timeSlot={timeSlot}
          setTimeSlot={setTimeSlot}
          serviceCategory={serviceCategory}
        />
      )}
    </div>
  );
};

export default DateTimeSection;
