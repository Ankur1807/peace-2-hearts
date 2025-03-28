
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckSquare, Square } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConsultationBookingHook } from '@/hooks/useConsultationBooking';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ConsultationBookingFormProps {
  bookingState: ConsultationBookingHook;
}

const mentalHealthServices = [
  { id: 'mental-health-counselling', label: 'Mental Health Counselling' },
  { id: 'family-therapy', label: 'Family Therapy' },
  { id: 'premarital-counselling', label: 'Premarital Counselling' },
  { id: 'couples-counselling', label: 'Couples Counselling' },
  { id: 'sexual-health-counselling', label: 'Sexual Health Counselling' }
];

const legalServices = [
  { id: 'pre-marriage-legal', label: 'Pre-marriage Legal Consultation' },
  { id: 'mediation', label: 'Mediation Services' },
  { id: 'divorce', label: 'Divorce Consultation' },
  { id: 'custody', label: 'Child Custody Consultation' },
  { id: 'maintenance', label: 'Maintenance Consultation' },
  { id: 'general-legal', label: 'General Legal Consultation' }
];

const holisticPackages = [
  { 
    id: 'divorce-prevention', 
    label: 'Divorce Prevention Package', 
    description: '4 sessions (2 therapy + 1 mediation + 1 legal)',
    services: ['couples-counselling', 'mental-health-counselling', 'mediation', 'general-legal']
  },
  { 
    id: 'pre-marriage-clarity', 
    label: 'Pre-Marriage Clarity Package', 
    description: '3 sessions (1 legal + 2 mental health)',
    services: ['pre-marriage-legal', 'premarital-counselling', 'mental-health-counselling'] 
  }
];

const ConsultationBookingForm: React.FC<ConsultationBookingFormProps> = ({ bookingState }) => {
  const {
    date, 
    setDate,
    serviceCategory,
    setServiceCategory,
    selectedServices,
    setSelectedServices,
    timeSlot,
    setTimeSlot,
    isProcessing,
    personalDetails,
    handlePersonalDetailsChange,
    handleConfirmBooking
  } = bookingState;

  const handlePersonalDetailsFieldChange = (field: string, value: string) => {
    handlePersonalDetailsChange({
      ...personalDetails,
      [field]: value
    });
  };

  const handleServiceSelection = (serviceId: string, checked: boolean) => {
    if (checked) {
      if (serviceCategory === 'holistic' && selectedServices.length >= 4 && !selectedServices.includes(serviceId)) {
        return;
      }
      setSelectedServices(prev => [...prev, serviceId]);
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId));
    }
  };

  const handlePackageSelection = (packageId: string) => {
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSelectedServices(selectedPackage.services);
    }
  };

  useEffect(() => {
    setSelectedServices([]);
  }, [serviceCategory, setSelectedServices]);

  let serviceSelectionComponent;
  
  if (serviceCategory === 'holistic') {
    serviceSelectionComponent = (
      <div className="space-y-3">
        <Label>Package Selection</Label>
        <RadioGroup 
          onValueChange={handlePackageSelection} 
          className="space-y-3"
        >
          {holisticPackages.map(pkg => (
            <div key={pkg.id} className="flex items-start space-x-2">
              <RadioGroupItem value={pkg.id} id={pkg.id} />
              <div className="grid gap-1">
                <label
                  htmlFor={pkg.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {pkg.label}
                </label>
                <p className="text-xs text-muted-foreground">{pkg.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  } else {
    const servicesToDisplay = serviceCategory === 'mental-health' 
      ? mentalHealthServices 
      : legalServices;
      
    serviceSelectionComponent = (
      <div className="space-y-3">
        <Label>Service Types</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {servicesToDisplay.map(service => (
            <div key={service.id} className="flex items-center space-x-2">
              <Checkbox 
                id={service.id}
                checked={selectedServices.includes(service.id)}
                onCheckedChange={(checked) => handleServiceSelection(service.id, checked === true)}
              />
              <label
                htmlFor={service.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {service.label}
              </label>
            </div>
          ))}
        </div>
        
        {selectedServices.length === 0 && (
          <p className="text-sm text-muted-foreground">Please select at least one service</p>
        )}
      </div>
    );
  }

  const isFormValid = () => {
    return (
      selectedServices.length > 0 &&
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
        <div className="space-y-2">
          <Label htmlFor="service-category">Service Category</Label>
          <Select value={serviceCategory} onValueChange={setServiceCategory}>
            <SelectTrigger id="service-category">
              <SelectValue placeholder="Select service category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="holistic">Holistic Solutions</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="legal">Legal Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {serviceSelectionComponent}
        
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
