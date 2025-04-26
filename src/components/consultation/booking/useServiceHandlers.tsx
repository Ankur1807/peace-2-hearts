
import { useCallback, useEffect } from 'react';
import { holisticPackages } from './PackagesData';

interface ServiceHandlersProps {
  setSelectedServices: (services: string[]) => void;
}

export const useServiceHandlers = ({ setSelectedServices }: ServiceHandlersProps) => {
  const handleServiceSelection = useCallback((serviceId: string, checked: boolean) => {
    console.log(`Service ${serviceId} selection changed to ${checked}`);
    if (checked && serviceId) {
      setSelectedServices([serviceId]);
      console.log("New selected service:", serviceId);
    } else {
      setSelectedServices([]);
      console.log("Cleared service selection");
    }
  }, [setSelectedServices]);

  const handlePackageSelection = useCallback((packageId: string) => {
    console.log(`Package ${packageId} selected`);
    const selectedPackage = holisticPackages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      setSelectedServices([packageId]);
      console.log(`Selected package: ${packageId}`);
    }
  }, [setSelectedServices]);

  // Initialize from URL params if any
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const subServiceParam = urlParams.get('subservice');
    if (subServiceParam) {
      console.log("Setting service from URL parameter:", subServiceParam);
      setSelectedServices([subServiceParam]);
    }
  }, [setSelectedServices]);

  return {
    handleServiceSelection,
    handlePackageSelection
  };
};
