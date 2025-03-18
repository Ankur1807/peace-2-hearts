
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Specialization</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="mental-health"
              name="specialization"
              value="mental-health"
              checked={specialization === "mental-health"}
              onChange={() => setSpecialization("mental-health")}
              className="h-4 w-4 text-purple-600"
            />
            <Label htmlFor="mental-health" className="cursor-pointer">Mental Health</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="legal-support"
              name="specialization"
              value="legal-support"
              checked={specialization === "legal-support"}
              onChange={() => setSpecialization("legal-support")}
              className="h-4 w-4 text-purple-600"
            />
            <Label htmlFor="legal-support" className="cursor-pointer">Legal Support</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="hourlyRate" className="mb-2 block">Hourly Rate (₹)</Label>
        <Input
          type="number"
          id="hourlyRate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          placeholder="2000"
          min="500"
        />
      </div>

      <div>
        <Label htmlFor="qualifications" className="mb-2 block">Professional Qualifications</Label>
        <Input
          id="qualifications"
          value={qualifications}
          onChange={(e) => setQualifications(e.target.value)}
          placeholder="e.g., MA in Psychology, 5 years of experience"
        />
      </div>

      <div>
        <Label htmlFor="bio" className="mb-2 block">Professional Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about your experience and expertise..."
          rows={4}
        />
      </div>

      <div>
        <Label className="mb-2 block">Available Days</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day.value} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day.value}`}
                checked={availableDays.includes(day.value)}
                onCheckedChange={() => handleDayToggle(day.value)}
              />
              <Label htmlFor={`day-${day.value}`} className="cursor-pointer">{day.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="availableHours" className="mb-2 block">Working Hours</Label>
        <select
          id="availableHours"
          value={availableHours}
          onChange={(e) => setAvailableHours(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {availableTimeSlots.map((slot) => (
            <option key={slot.value} value={slot.value}>
              {slot.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ConsultantFields;
