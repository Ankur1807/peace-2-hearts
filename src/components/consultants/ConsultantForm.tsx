
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Consultant, createConsultant } from "@/utils/consultantApi";

interface ConsultantFormProps {
  onSuccess: (consultant: Consultant) => void;
  onCancel: () => void;
}

const ConsultantForm = ({ onSuccess, onCancel }: ConsultantFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "legal",
    hourly_rate: 1000,
    bio: "",
    qualifications: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_hours: "9:00-17:00",
    is_available: true,
    profile_id: "00000000-0000-0000-0000-000000000000",
    profile_picture: null as File | null
  });
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({
        ...formData,
        profile_picture: event.target.files[0]
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const consultantData = {
        ...formData,
        hourly_rate: Number(formData.hourly_rate)
      };
      
      const newConsultant = await createConsultant(consultantData);
      
      toast({
        title: "Success",
        description: "Consultant added successfully",
      });
      
      onSuccess(newConsultant);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add consultant",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Consultant's full name"
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
          onChange={handleFileChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select
          name="specialization"
          value={formData.specialization}
          onValueChange={(value) => handleSelectChange("specialization", value)}
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
          onChange={handleInputChange}
          min={0}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Consultant's biographical information"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications</Label>
        <Textarea
          id="qualifications"
          name="qualifications"
          value={formData.qualifications}
          onChange={handleInputChange}
          placeholder="Consultant's qualifications and credentials"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="available_hours">Available Hours</Label>
        <Input
          id="available_hours"
          name="available_hours"
          value={formData.available_hours}
          onChange={handleInputChange}
          placeholder="e.g., 9:00-17:00"
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button type="submit">Add Consultant</Button>
      </DialogFooter>
    </form>
  );
};

export default ConsultantForm;
