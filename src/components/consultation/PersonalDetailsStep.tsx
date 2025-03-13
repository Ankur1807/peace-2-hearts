
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

type PersonalDetailsStepProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string;
  setTimeSlot: (timeSlot: string) => void;
  personalDetails: PersonalDetails;
  onPersonalDetailsChange: (details: PersonalDetails) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
};

const PersonalDetailsStep = ({
  date,
  setDate,
  timeSlot,
  setTimeSlot,
  personalDetails,
  onPersonalDetailsChange,
  onNextStep,
  onPrevStep
}: PersonalDetailsStepProps) => {
  const handleChange = (field: keyof PersonalDetails, value: string) => {
    onPersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };

  const isFormValid = () => {
    return (
      personalDetails.firstName.trim() !== '' &&
      personalDetails.lastName.trim() !== '' &&
      personalDetails.email.trim() !== '' &&
      personalDetails.phone.trim() !== '' &&
      date !== undefined &&
      timeSlot !== ''
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-lora font-semibold mb-6">Personal Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input 
            id="first-name" 
            value={personalDetails.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input 
            id="last-name" 
            value={personalDetails.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={personalDetails.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          value={personalDetails.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          required 
        />
      </div>
      
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => 
                date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                date.getDay() === 0 ||
                date.getDay() === 6
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Preferred Time</Label>
        <Select value={timeSlot} onValueChange={setTimeSlot}>
          <SelectTrigger>
            <SelectValue placeholder="Select a time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9-am">9:00 AM</SelectItem>
            <SelectItem value="10-am">10:00 AM</SelectItem>
            <SelectItem value="11-am">11:00 AM</SelectItem>
            <SelectItem value="1-pm">1:00 PM</SelectItem>
            <SelectItem value="2-pm">2:00 PM</SelectItem>
            <SelectItem value="3-pm">3:00 PM</SelectItem>
            <SelectItem value="4-pm">4:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Brief Description of Your Situation</Label>
        <Textarea 
          id="message" 
          placeholder="Please provide a brief overview of your situation to help us prepare for your consultation."
          rows={4}
          value={personalDetails.message}
          onChange={(e) => handleChange('message', e.target.value)}
        />
      </div>
      
      <div className="pt-6 flex justify-between">
        <Button type="button" variant="outline" onClick={onPrevStep}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={onNextStep}
          className="bg-peacefulBlue hover:bg-peacefulBlue/90"
          disabled={!isFormValid()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PersonalDetailsStep;
