
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ConsultantFormData } from "@/hooks/useConsultantForm";

interface ConsultantFormFieldsProps {
  formData: ConsultantFormData;
  isSubmitting: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDayToggle: (day: string) => void;
}

const ConsultantFormFields = ({
  formData,
  isSubmitting,
  onInputChange,
  onFileChange,
  onSelectChange,
  onDayToggle
}: ConsultantFormFieldsProps) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Consultant's name"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile_picture">Profile Picture</Label>
        <Input
          id="profile_picture"
          name="profile_picture"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">Upload a professional profile picture (optional).</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select
          name="specialization"
          value={formData.specialization}
          onValueChange={(value) => onSelectChange("specialization", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="legal">Legal Expert</SelectItem>
            <SelectItem value="mental_health">Mental Health Expert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Available Days</Label>
        <div className="grid grid-cols-2 gap-4">
          {weekDays.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={`day-${day}`}
                checked={formData.available_days.includes(day)}
                onCheckedChange={() => onDayToggle(day)}
                disabled={isSubmitting}
              />
              <Label htmlFor={`day-${day}`} className="cursor-pointer">{day}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="available_hours">Working Hours</Label>
        <Input
          id="available_hours"
          name="available_hours"
          value={formData.available_hours}
          onChange={onInputChange}
          placeholder="e.g., 9:00-17:00"
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">Enter hours in 24-hour format (e.g., 9:00-17:00)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experience">Experience (years)</Label>
        <Input
          id="experience"
          name="experience"
          type="number"
          value={formData.experience}
          onChange={onInputChange}
          min={0}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
        <Input
          id="hourly_rate"
          name="hourly_rate"
          type="number"
          value={formData.hourly_rate}
          onChange={onInputChange}
          min={0}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={onInputChange}
          placeholder="Consultant's biographical information"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications</Label>
        <Textarea
          id="qualifications"
          name="qualifications"
          value={formData.qualifications}
          onChange={onInputChange}
          placeholder="Consultant's qualifications and credentials"
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};

export default ConsultantFormFields;
