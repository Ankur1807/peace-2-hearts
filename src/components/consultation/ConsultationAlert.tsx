
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConsultationAlertProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

const ConsultationAlert = ({ 
  title, 
  description, 
  variant = "destructive" 
}: ConsultationAlertProps) => {
  return (
    <Alert variant={variant} className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default ConsultationAlert;
