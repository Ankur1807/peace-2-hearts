
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Consultant } from "@/utils/consultants/types";
import { useConsultantForm } from "@/hooks/useConsultantForm";
import ConsultantFormFields from "./ConsultantFormFields";

interface ConsultantFormProps {
  onSuccess: (consultant: Consultant) => void;
  onCancel: () => void;
}

const ConsultantForm = ({ onSuccess, onCancel }: ConsultantFormProps) => {
  const {
    formData,
    isSubmitting,
    error,
    handleInputChange,
    handleFileChange,
    handleSelectChange,
    handleSubmit,
  } = useConsultantForm({ onSuccess, onCancel });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ConsultantFormFields
        formData={formData}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSelectChange={handleSelectChange}
      />
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Consultant"}
        </Button>
      </div>
    </form>
  );
};

export default ConsultantForm;
