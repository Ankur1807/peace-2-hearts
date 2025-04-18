
import React, { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  serviceCategory: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  serviceCategory
}) => {
  // Get tomorrow as the minimum selectable date
  const tomorrow = useMemo(() => addDays(new Date(), 1), []);
  
  // Get available time slots based on service category
  const availableTimeSlots = useMemo(() => {
    if (serviceCategory === 'legal') {
      // Legal consultations: 5 PM - 8 PM
      return [
        { value: '5-pm', label: '5:00 PM' },
        { value: '6-pm', label: '6:00 PM' },
        { value: '7-pm', label: '7:00 PM' },
        { value: '8-pm', label: '8:00 PM' },
      ];
    } else {
      // Mental health: 11 AM - 8 PM
      return [
        { value: '11-am', label: '11:00 AM' },
        { value: '12-pm', label: '12:00 PM' },
        { value: '1-pm', label: '1:00 PM' },
        { value: '2-pm', label: '2:00 PM' },
        { value: '3-pm', label: '3:00 PM' },
        { value: '4-pm', label: '4:00 PM' },
        { value: '5-pm', label: '5:00 PM' },
        { value: '6-pm', label: '6:00 PM' },
        { value: '7-pm', label: '7:00 PM' },
        { value: '8-pm', label: '8:00 PM' },
      ];
    }
  }, [serviceCategory]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <CalendarIcon className="h-5 w-5 text-peacefulBlue" /> 
          Preferred Date
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-gray-300 hover:border-peacefulBlue",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="pointer-events-auto"
              disabled={(date) => 
                // Disable past dates and today
                date < tomorrow
              }
              fromDate={tomorrow}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time" className="flex items-center gap-2 text-lg font-medium text-gray-800">
          <Clock className="h-5 w-5 text-peacefulBlue" />
          Preferred Time
        </Label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger id="time" className="border-gray-300 hover:border-peacefulBlue">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            {availableTimeSlots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {serviceCategory === 'legal' 
            ? 'Legal consultations available from 5 PM - 8 PM' 
            : 'Mental health consultations available from 11 AM - 8 PM'}
        </p>
      </div>
    </div>
  );
};

export default DateTimePicker;
