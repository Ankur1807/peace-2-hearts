
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsultationAlertProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  className?: string;
}

const ConsultationAlert = ({ 
  title, 
  description, 
  variant = "destructive",
  className
}: ConsultationAlertProps) => {
  return (
    <Alert variant={variant} className={cn("mb-6", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default ConsultationAlert;
