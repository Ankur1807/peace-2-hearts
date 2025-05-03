
import { useState, useEffect } from 'react';
import { ServicePrice } from '@/utils/pricing/types';

export const usePackageSync = (packages: ServicePrice[]) => {
  const [syncNeeded, setSyncNeeded] = useState(false);

  useEffect(() => {
    // Check if any packages need syncing (have different prices for same name)
    const packagesMap = new Map();
    packages.forEach(pkg => {
      if (!packagesMap.has(pkg.service_name)) {
        packagesMap.set(pkg.service_name, [pkg.price]);
      } else {
        packagesMap.get(pkg.service_name).push(pkg.price);
      }
    });

    // Check if any package has inconsistent prices
    let needsSync = false;
    packagesMap.forEach((prices) => {
      if (new Set(prices).size > 1) {
        needsSync = true;
      }
    });
    setSyncNeeded(needsSync);
  }, [packages]);

  return { syncNeeded };
};
