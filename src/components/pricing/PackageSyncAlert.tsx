
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PackageSyncAlertProps {
  show: boolean;
}

const PackageSyncAlert = ({ show }: PackageSyncAlertProps) => {
  if (!show) return null;

  return (
    <Alert variant="default" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Inconsistent pricing detected for the same package. Click "Sync Package Prices" to fix this issue.
      </AlertDescription>
    </Alert>
  );
};

export default PackageSyncAlert;
