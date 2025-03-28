
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Consultant } from "@/utils/consultantApi";
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="mr-2"
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
      </DialogFooter>
    </form>
  );
};

export default ConsultantForm;
