
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConsultantFormData } from "@/hooks/useConsultantForm";

interface ConsultantFormFieldsProps {
  formData: ConsultantFormData;
  isSubmitting: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ConsultantFormFields = ({
  formData,
  isSubmitting,
  onInputChange,
  onFileChange,
  onSelectChange
}: ConsultantFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="profile_picture">Profile Picture</Label>
        <Input
          id="profile_picture"
          name="profile_picture"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={true} // Disable the file input
        />
        <p className="text-xs text-gray-500">Profile pictures are currently disabled.</p>
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
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="mental_health">Mental Health</SelectItem>
            <SelectItem value="family_therapy">Family Therapy</SelectItem>
            <SelectItem value="mediation">Mediation</SelectItem>
            <SelectItem value="divorce">Divorce</SelectItem>
            <SelectItem value="custody">Child Custody</SelectItem>
          </SelectContent>
        </Select>
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
