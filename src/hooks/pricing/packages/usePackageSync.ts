
import { useMemo } from 'react';
import { ServicePrice } from '@/utils/pricing/types';

export const usePackageSync = (packages: ServicePrice[]) => {
  // Determine if packages need syncing (if the same package name exists with different prices)
  const syncNeeded = useMemo(() => {
    const packageMap = new Map<string, Set<number>>();
    
    // Group packages by name and collect their prices
    packages.forEach(pkg => {
      const name = pkg.service_name;
      if (!packageMap.has(name)) {
        packageMap.set(name, new Set());
      }
      packageMap.get(name)?.add(pkg.price);
    });
    
    // Check if any package name has multiple prices
    let needsSync = false;
    packageMap.forEach((prices) => {
      if (prices.size > 1) {
        needsSync = true;
      }
    });
    
    return needsSync;
  }, [packages]);

  return {
    syncNeeded
  };
};
