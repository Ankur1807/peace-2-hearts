
import { useEffect } from 'react';
import { runSystemDiagnostics } from '@/utils/diagnostics/systemHealthCheck';

interface DiagnosticsRunnerProps {
  pricing?: Map<string, number>;
  selectedServices: string[];
  totalPrice: number;
  enabled?: boolean;
}

const DiagnosticsRunner: React.FC<DiagnosticsRunnerProps> = ({ 
  pricing, 
  selectedServices, 
  totalPrice,
  enabled = true 
}) => {
  useEffect(() => {
    if (enabled) {
      runSystemDiagnostics(pricing, selectedServices, totalPrice);
    }
  }, [pricing, selectedServices, totalPrice, enabled]);
  
  // This is a non-visual component
  return null;
};

export default DiagnosticsRunner;
