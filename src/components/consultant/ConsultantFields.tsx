
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ConsultantFieldsProps {
  specialization: string;
  setSpecialization: (value: string) => void;
  hourlyRate: number;
  setHourlyRate: (value: number) => void;
  bio: string;
  setBio: (value: string) => void;
  qualifications: string;
  setQualifications: (value: string) => void;
  availableDays: string[];
  setAvailableDays: (value: string[]) => void;
  availableHours: string;
  setAvailableHours: (value: string) => void;
}

const daysOfWeek = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

const availableTimeSlots = [
  { label: "9:00 AM - 5:00 PM", value: "9:00-17:00" },
  { label: "10:00 AM - 6:00 PM", value: "10:00-18:00" },
  { label: "11:00 AM - 7:00 PM", value: "11:00-19:00" },
  { label: "12:00 PM - 8:00 PM", value: "12:00-20:00" },
];

const ConsultantFields: React.FC<ConsultantFieldsProps> = ({
  specialization,
  setSpecialization,
  hourlyRate,
  setHourlyRate,
  bio,
  setBio,
  qualifications,
  setQualifications,
  availableDays,
  setAvailableDays,
  availableHours,
  setAvailableHours,
}) => {
  const handleDayToggle = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label className="font-medium text-base">What's your specialization?</Label>
          <RadioGroup
            value={specialization}
            onValueChange={setSpecialization}
            className="flex flex-col space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mental-health" id="mental-health" />
              <Label htmlFor="mental-health" className="cursor-pointer">
                Mental Health Professional
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="legal-support" id="legal-support" />
              <Label htmlFor="legal-support" className="cursor-pointer">
                Legal Advisor
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hourlyRate" className="font-medium text-base">
            What's your hourly rate? (₹)
          </Label>
          <Input
            type="number"
            id="hourlyRate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            placeholder="2000"
            min="500"
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground">Recommended range: ₹1500 - ₹5000 per hour</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualifications" className="font-medium text-base">
            Professional Qualifications
          </Label>
          <Input
            id="qualifications"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
            placeholder="e.g., MA in Psychology, 5 years of experience"
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="font-medium text-base">
            Professional Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your experience and expertise..."
            rows={4}
            className="mt-1 resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Describe your expertise, approach, and what clients can expect from working with you
          </p>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-base">Available Days</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {daysOfWeek.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day.value}`}
                  checked={availableDays.includes(day.value)}
                  onCheckedChange={() => handleDayToggle(day.value)}
                  className="data-[state=checked]:bg-vibrantPurple data-[state=checked]:text-white"
                />
                <Label htmlFor={`day-${day.value}`} className="cursor-pointer">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableHours" className="font-medium text-base">
            Working Hours
          </Label>
          <Select value={availableHours} onValueChange={setAvailableHours}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select your working hours" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.map((slot) => (
                <SelectItem key={slot.value} value={slot.value}>
                  {slot.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultantFields;
