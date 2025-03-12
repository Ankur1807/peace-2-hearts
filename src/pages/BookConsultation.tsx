
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const BookConsultation = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [step, setStep] = useState(1);
  const [consultationType, setConsultationType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Consultation Booked",
      description: "Your consultation has been successfully scheduled. You'll receive a confirmation email shortly.",
    });
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <>
        <Navigation />
        <main className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center space-y-8">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="section-title text-4xl md:text-5xl">Thank You!</h1>
              <p className="text-lg text-gray-600">
                Your consultation has been successfully scheduled. We've sent a confirmation email with all the details.
              </p>
              <p className="text-lg text-gray-600">
                If you have any questions before your appointment, please don't hesitate to contact us.
              </p>
              <div className="pt-6">
                <Button className="hero-btn" onClick={() => window.location.href = '/'}>
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-4">Book Your Consultation</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Take the first step towards peace and clarity in your relationship journey. Our expert team is here to support you.
          </p>

          <div className="mb-10">
            <div className="flex justify-between items-center relative mb-6">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
                      step >= stepNumber ? "bg-peacefulBlue" : "bg-gray-300"
                    )}
                  >
                    {stepNumber}
                  </div>
                  <span className={cn(
                    "text-sm mt-2",
                    step >= stepNumber ? "text-peacefulBlue font-medium" : "text-gray-500"
                  )}>
                    {stepNumber === 1 ? "Service" : stepNumber === 2 ? "Details" : "Confirmation"}
                  </span>
                </div>
              ))}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
              <div 
                className="absolute top-5 left-0 h-0.5 bg-peacefulBlue -z-10 transition-all" 
                style={{ width: `${(step - 1) * 50}%` }}
              ></div>
            </div>
          </div>

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-lora font-semibold mb-6">Select Consultation Type</h2>
                  
                  <RadioGroup value={consultationType} onValueChange={setConsultationType} className="space-y-4">
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="mental-health" id="mental-health" className="mt-1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="mental-health" className="text-lg font-medium cursor-pointer">Mental Health Support</Label>
                          <p className="text-gray-600">Speak with a therapist about anxiety, depression, or stress related to relationships.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="legal" id="legal" className="mt-1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="legal" className="text-lg font-medium cursor-pointer">Legal Consultation</Label>
                          <p className="text-gray-600">Discuss divorce proceedings, custody arrangements, or other legal matters.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="therapy" id="therapy" className="mt-1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="therapy" className="text-lg font-medium cursor-pointer">Relationship Therapy</Label>
                          <p className="text-gray-600">Work with a therapist to improve communication and resolve relationship issues.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 cursor-pointer hover:border-peacefulBlue transition-colors">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="combined" id="combined" className="mt-1" />
                        <div className="grid gap-1.5">
                          <Label htmlFor="combined" className="text-lg font-medium cursor-pointer">Combined Support</Label>
                          <p className="text-gray-600">Access both legal and mental health support for comprehensive guidance.</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <div className="pt-6 flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      disabled={!consultationType}
                      className="hero-btn"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-lora font-semibold mb-6">Personal Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
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
                    <Select>
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
                    />
                  </div>
                  
                  <div className="pt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="hero-btn"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-lora font-semibold mb-6">Confirm Your Booking</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div>
                      <h3 className="text-gray-500 text-sm">Consultation Type</h3>
                      <p className="font-medium">
                        {consultationType === 'mental-health' ? 'Mental Health Support' : 
                         consultationType === 'legal' ? 'Legal Consultation' :
                         consultationType === 'therapy' ? 'Relationship Therapy' : 'Combined Support'}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-gray-500 text-sm">Date</h3>
                        <p className="font-medium">{date ? format(date, "PPP") : 'Not selected'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-500 text-sm">Time</h3>
                        <p className="font-medium">10:00 AM</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-500 text-sm">Duration</h3>
                      <p className="font-medium">60 minutes</p>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-500 text-sm">Format</h3>
                      <p className="font-medium">Video Call (link will be sent via email)</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Consultation Details</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Your consultation will be conducted via secure video call.</li>
                      <li>• You'll receive a confirmation email with connection details.</li>
                      <li>• Please join 5 minutes before your scheduled time.</li>
                      <li>• If you need to reschedule, please give 24 hours notice.</li>
                    </ul>
                  </div>
                  
                  <div className="pt-6 flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="hero-btn">
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookConsultation;
