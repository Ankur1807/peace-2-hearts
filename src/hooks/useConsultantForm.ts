
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Consultant, createConsultant } from "@/utils/consultantApi";

interface UseConsultantFormProps {
  onSuccess: (consultant: Consultant) => void;
  onCancel: () => void;
}

export interface ConsultantFormData {
  name: string;
  specialization: string;
  hourly_rate: number;
  bio: string;
  qualifications: string;
  available_days: string[];
  is_available: boolean;
  profile_id: string;
  profile_picture: File | null;
  experience: number;
}

export const useConsultantForm = ({ onSuccess, onCancel }: UseConsultantFormProps) => {
  const [formData, setFormData] = useState<ConsultantFormData>({
    name: "",
    specialization: "legal", // Default to legal expert
    hourly_rate: 1000,
    bio: "",
    qualifications: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    is_available: true,
    profile_id: crypto.randomUUID(), // Generate a random UUID
    profile_picture: null,
    experience: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === "experience" || name === "hourly_rate" ? Number(value) : value
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
    setError(null);
    
    setIsSubmitting(true);
    
    try {
      const consultantData = {
        ...formData,
        hourly_rate: Number(formData.hourly_rate),
        experience: Number(formData.experience)
      };
      
      console.log("Submitting consultant data:", consultantData);
      
      const newConsultant = await createConsultant(consultantData);
      
      toast({
        title: "Success",
        description: "Consultant added successfully",
      });
      
      onSuccess(newConsultant);
    } catch (error) {
      console.error("Error adding consultant:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add consultant";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleFileChange,
    handleSelectChange,
    handleSubmit,
    onCancel
  };
};
