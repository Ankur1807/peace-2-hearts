
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getTimeSlotLabel } from '@/utils/consultationLabels';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  serviceCategory: string;
  availableTimeSlots?: string[];
  minDate?: Date;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  serviceCategory,
  availableTimeSlots,
  minDate
}) => {
  // Use provided time slots or default ones
  const timeSlots = availableTimeSlots || [
    '9-am', '10-am', '11-am', '12-pm', '1-pm', '2-pm', 
    '3-pm', '4-pm', '5-pm', '6-pm', '7-pm', '8-pm'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select Date
        </Label>
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="bg-white p-3 rounded-lg"
            disabled={{ before: minDate || new Date() }}
          />
        </div>
      </div>
      
      {date && (
        <div className="space-y-2">
          <Label htmlFor="time-slot" className="block text-sm font-medium text-gray-700">
            Select Time Slot
          </Label>
          <ToggleGroup 
            type="single" 
            variant="outline" 
            value={timeSlot} 
            onValueChange={(value) => value && setTimeSlot(value)}
            className="flex flex-wrap gap-2"
          >
            {timeSlots.map((slot) => (
              <ToggleGroupItem 
                key={slot} 
                value={slot}
                aria-label={`Select ${getTimeSlotLabel(slot)}`}
                className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium transition-colors data-[state=on]:bg-peacefulBlue data-[state=on]:text-white"
              >
                {getTimeSlotLabel(slot)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {!date && (
        <p className="text-sm text-muted-foreground">
          Please select a date to see available time slots
        </p>
      )}
      
      {date && !timeSlot && (
        <p className="text-sm text-muted-foreground">
          Please select a time slot
        </p>
      )}
    </div>
  );
};

export default DateTimePicker;
