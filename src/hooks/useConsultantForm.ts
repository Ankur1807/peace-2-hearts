import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Consultant, createConsultant } from "@/utils/consultants";

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
  available_hours: string;
  is_available: boolean;
  profile_id: string;
  profile_picture: File | null;
  experience: number;
}

export const useConsultantForm = ({ onSuccess, onCancel }: UseConsultantFormProps) => {
  const [formData, setFormData] = useState<ConsultantFormData>({
    name: "",
    specialization: "legal",
    hourly_rate: 1000,
    bio: "",
    qualifications: "",
    available_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    available_hours: "9:00-17:00",
    is_available: true,
    profile_id: crypto.randomUUID(),
    profile_picture: null,
    experience: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      if (prev.available_days.includes(day)) {
        return {
          ...prev,
          available_days: prev.available_days.filter(d => d !== day)
        };
      }
      return {
        ...prev,
        available_days: [...prev.available_days, day].sort((a, b) => {
          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
          return days.indexOf(a) - days.indexOf(b);
        })
      };
    });
  };

  const checkAdminSession = (): boolean => {
    const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
    const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isAuthValid = adminAuthenticated && (Date.now() - authTime < sessionDuration);
    
    return isAuthValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    if (!checkAdminSession()) {
      toast({
        title: "Session expired",
        description: "Your session has expired. Please sign in again.",
        variant: "destructive",
      });
      
      navigate("/admin/login");
      return;
    }
    
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
    handleDayToggle,
    handleSubmit,
    onCancel
  };
};
