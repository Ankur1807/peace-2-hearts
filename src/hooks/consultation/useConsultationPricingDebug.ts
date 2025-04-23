
import React from 'react';
import { getPackageName } from '@/utils/consultation/packageUtils';

export function useConsultationPricingDebug(totalPrice, selectedServices, pricing) {
  React.useEffect(() => {
    console.log(`Current totalPrice: ${totalPrice}, Selected services: ${selectedServices.join(', ')}`);

    if (selectedServices.length === 1) {
      const serviceId = selectedServices[0];
      console.log(`Single service selected: ${serviceId}, Price: ${pricing.get(serviceId) || 'not found'}`);
    }

    const packageName = getPackageName(selectedServices);
    if (packageName) {
      const packageId =
        packageName === 'Divorce Prevention Package'
          ? 'divorce-prevention'
          : 'pre-marriage-clarity';
      console.log(`Selected package: ${packageName} (${packageId}), Price: ${pricing.get(packageId) || 'not found'}`);
    }
  }, [totalPrice, selectedServices, pricing]);
}
