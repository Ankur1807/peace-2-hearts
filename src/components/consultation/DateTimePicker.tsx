
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
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
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  date,
  setDate,
  timeSlot,
  setTimeSlot
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Preferred Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
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
                date < new Date(new Date().setHours(0, 0, 0, 0))
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Preferred Time</Label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger id="time">
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7-am">7:00 AM</SelectItem>
            <SelectItem value="8-am">8:00 AM</SelectItem>
            <SelectItem value="9-am">9:00 AM</SelectItem>
            <SelectItem value="10-am">10:00 AM</SelectItem>
            <SelectItem value="11-am">11:00 AM</SelectItem>
            <SelectItem value="12-pm">12:00 PM</SelectItem>
            <SelectItem value="1-pm">1:00 PM</SelectItem>
            <SelectItem value="2-pm">2:00 PM</SelectItem>
            <SelectItem value="3-pm">3:00 PM</SelectItem>
            <SelectItem value="4-pm">4:00 PM</SelectItem>
            <SelectItem value="5-pm">5:00 PM</SelectItem>
            <SelectItem value="6-pm">6:00 PM</SelectItem>
            <SelectItem value="7-pm">7:00 PM</SelectItem>
            <SelectItem value="8-pm">8:00 PM</SelectItem>
            <SelectItem value="9-pm">9:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default DateTimePicker;

