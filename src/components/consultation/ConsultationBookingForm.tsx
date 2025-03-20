
import React from 'react';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    date, 
    setDate,
    consultationType,
    setConsultationType,
    timeSlot,
    setTimeSlot,
    isProcessing,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking
  } = bookingState;

  const [serviceCategory, setServiceCategory] = React.useState("mental-health");

  const handlePersonalDetailsFieldChange = (field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };

  const isFormValid = () => {
    return (
      consultationType !== '' &&
      date !== undefined &&
      timeSlot !== '' &&
      personalDetails.firstName.trim() !== '' &&
      personalDetails.lastName.trim() !== '' &&
      personalDetails.email.trim() !== '' &&
      personalDetails.phone.trim() !== ''
    );
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-lora font-semibold mb-6">Book Your Consultation</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleConfirmBooking();
      }} className="space-y-6">
        {/* Service Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="service-category">Service Category</Label>
          <Select value={serviceCategory} onValueChange={setServiceCategory}>
            <SelectTrigger id="service-category">
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="legal">Legal Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Service Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="consultation-type">Service Type</Label>
          <Select value={consultationType} onValueChange={setConsultationType}>
            <SelectTrigger id="consultation-type">
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceCategory === 'mental-health' ? (
                <>
                  <SelectItem value="mental-health-counselling">Mental Health Counselling</SelectItem>
                  <SelectItem value="family-therapy">Family Therapy</SelectItem>
                  <SelectItem value="premarital-counselling">Premarital Counselling</SelectItem>
                  <SelectItem value="couples-counselling">Couples Counselling</SelectItem>
                  <SelectItem value="sexual-health-counselling">Sexual Health Counselling</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="pre-marriage-legal">Pre-marriage Legal Consultation</SelectItem>
                  <SelectItem value="mediation">Mediation Services</SelectItem>
                  <SelectItem value="divorce">Divorce Consultation</SelectItem>
                  <SelectItem value="custody">Child Custody Consultation</SelectItem>
                  <SelectItem value="maintenance">Maintenance Consultation</SelectItem>
                  <SelectItem value="general-legal">General Legal Consultation</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Selection */}
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
                  date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                  date.getDay() === 0 ||
                  date.getDay() === 6
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="time">Preferred Time</Label>
          <Select value={timeSlot} onValueChange={setTimeSlot}>
            <SelectTrigger id="time">
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
        
        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input 
              id="first-name" 
              value={personalDetails.firstName}
              onChange={(e) => handlePersonalDetailsFieldChange('firstName', e.target.value)}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input 
              id="last-name" 
              value={personalDetails.lastName}
              onChange={(e) => handlePersonalDetailsFieldChange('lastName', e.target.value)}
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
            onChange={(e) => handlePersonalDetailsFieldChange('email', e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={personalDetails.phone}
            onChange={(e) => handlePersonalDetailsFieldChange('phone', e.target.value)}
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Brief Description (Optional)</Label>
          <Textarea 
            id="message" 
            placeholder="Please provide a brief overview of your situation to help us prepare for your consultation."
            rows={4}
            value={personalDetails.message}
            onChange={(e) => handlePersonalDetailsFieldChange('message', e.target.value)}
          />
        </div>
        
        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full bg-peacefulBlue hover:bg-peacefulBlue/90"
            disabled={!isFormValid() || isProcessing}
          >
            {isProcessing ? "Processing..." : "Book Consultation"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ConsultationBookingForm;
