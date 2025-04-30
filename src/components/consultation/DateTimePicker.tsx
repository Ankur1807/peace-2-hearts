import React from 'react';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  serviceCategory: string;
  availableTimeSlots: string[];
  minDate: Date;
  isDateDisabled?: (date: Date) => boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  serviceCategory,
  availableTimeSlots,
  minDate,
  isDateDisabled
}) => {
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);

  const formatTimeSlot = (slot: string) => {
    const [hour, period] = slot.split('-');
    return `${hour}:00 ${period.toUpperCase()}`;
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    // Add detailed logging to track the selected date
    console.log('📅 User clicked date (raw):', selectedDate);
    if (selectedDate) {
      console.log('📅 User clicked date (formatted):', format(selectedDate, 'yyyy-MM-dd'));
      console.log('📅 User clicked date (ISO):', selectedDate.toISOString());
      console.log('📅 User clicked date (local):', selectedDate.toLocaleDateString());
    }
    
    // Ensure we set the correct date by setting hours to noon to avoid timezone issues
    // This ensures the date remains the same regardless of timezone conversions
    if (selectedDate) {
      const correctedDate = new Date(selectedDate);
      correctedDate.setHours(12, 0, 0, 0); // Set to noon to avoid any date shifting due to timezone
      console.log('📅 Corrected date with noon time:', correctedDate);
      console.log('📅 Corrected date ISO:', correctedDate.toISOString());
      setDate(correctedDate);
    } else {
      setDate(undefined);
    }
    
    setCalendarOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label 
          htmlFor="date" 
          className="text-base font-medium block text-gray-700 mb-1"
        >
          Choose a Date
        </Label>
        <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal text-sm md:text-base",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span className="truncate">Select your preferred date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0" 
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={isDateDisabled || ((date) => date < minDate)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-medium block text-gray-700 mb-1">Choose a Time</Label>
        <RadioGroup 
          value={timeSlot} 
          onValueChange={setTimeSlot} 
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {availableTimeSlots.map((slot) => (
            <div key={slot} className="flex items-center space-x-2">
              <RadioGroupItem value={slot} id={`time-${slot}`} />
              <Label
                htmlFor={`time-${slot}`}
                className="cursor-pointer text-sm md:text-base"
              >
                {formatTimeSlot(slot)}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {!timeSlot && (
          <p className="text-xs text-red-500 mt-1">Please select a time slot</p>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
