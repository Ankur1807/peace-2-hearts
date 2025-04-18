
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePrice } from '@/utils/pricingTypes';
import PackageTable from './PackageTable';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdminContext';
import { syncPackageIds, updatePackagePrice } from '@/utils/pricing/serviceOperations';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PackagePricing = () => {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncNeeded, setSyncNeeded] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const fetchPackages = async (showMessage = false) => {
    try {
      setLoading(true);
      console.log('Fetching packages from Supabase...');
      
      // Add cache-busting parameter to avoid caching issues
      const timestamp = Date.now();
      
      const { data, error } = await supabase
        .from('package_pricing')
        .select('*')
        .order('package_name', { ascending: true });

      if (error) {
        console.error('Error fetching packages:', error);
        toast({
          title: 'Error',
          description: `Failed to fetch packages: ${error.message}`,
          variant: 'destructive',
        });
        return;
      }

      // Log what we received from the database for debugging
      console.log('Fetched package pricing data:', data);
      
      // Check if there are duplicate package names with different prices
      if (data) {
        const packageGroups = new Map<string, PackagePrice[]>();
        
        // Group packages by name
        data.forEach(pkg => {
          if (!packageGroups.has(pkg.package_name)) {
            packageGroups.set(pkg.package_name, []);
          }
          packageGroups.get(pkg.package_name)!.push(pkg);
        });
        
        // Check if any group has inconsistent pricing
        let inconsistencyFound = false;
        packageGroups.forEach((pkgs, name) => {
          if (pkgs.length > 1) {
            const prices = [...new Set(pkgs.map(p => p.price))];
            if (prices.length > 1) {
              console.warn(`Inconsistent pricing found for package '${name}': ${prices.join(', ')}`);
              inconsistencyFound = true;
            }
          }
        });
        
        setSyncNeeded(inconsistencyFound);
      }
      
      setPackages(data || []);
      
      if (showMessage && data) {
        toast({
          title: 'Refresh Complete',
          description: `Successfully loaded ${data.length} packages`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch packages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPackages(true);
  };

  const handleEditPrice = async (id: string, price: number) => {
    try {
      setUpdating(true);
      console.log(`Updating package ID ${id} with new price: ${price}`);
      
      if (!isAdmin) {
        throw new Error("You don't have admin permission to update prices");
      }
      
      // Get the package info before updating
      const { data: packageData } = await supabase
        .from('package_pricing')
        .select('*')
        .eq('id', id)
        .single();
      
      if (!packageData) {
        throw new Error("Package not found");
      }
      
      // Update the package price
      await updatePackagePrice(id, price);
      
      // If this package is the Divorce Prevention Package, sync all instances
      if (packageData.package_name.toLowerCase().includes('divorce prevention')) {
        await syncPackageIds('Divorce Prevention Package', 'divorce-prevention', price);
      } 
      // If this package is the Pre-Marriage Clarity Package, sync all instances
      else if (packageData.package_name.toLowerCase().includes('pre-marriage clarity')) {
        await syncPackageIds('Pre-Marriage Clarity Package', 'pre-marriage-clarity', price);
      }
      
      toast({
        title: 'Price Updated',
        description: 'Package price has been successfully updated.',
      });

      // Immediately refresh package data after update - important
      await fetchPackages();
    } catch (error: any) {
      console.error('Failed to update price:', error);
      toast({
        title: 'Error',
        description: `Failed to update price: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncPackages = async () => {
    try {
      setUpdating(true);
      
      if (!isAdmin) {
        throw new Error("You don't have admin permission to sync packages");
      }
      
      // Sync Divorce Prevention Package
      await syncPackageIds('Divorce Prevention Package', 'divorce-prevention', 8500);
      
      // Sync Pre-Marriage Clarity Package
      await syncPackageIds('Pre-Marriage Clarity Package', 'pre-marriage-clarity', 7500);
      
      toast({
        title: 'Packages Synchronized',
        description: 'All package IDs and prices have been synchronized.',
      });
      
      setSyncNeeded(false);
      
      // Refresh package data
      await fetchPackages();
    } catch (error: any) {
      console.error('Failed to sync packages:', error);
      toast({
        title: 'Error',
        description: `Failed to sync packages: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      setUpdating(true);
      const timestamp = new Date().toISOString();
      
      if (!isAdmin) {
        throw new Error("You don't have admin permission to change status");
      }
      
      const { data, error } = await supabase
        .from('package_pricing')
        .update({ 
          is_active: !currentStatus, 
          updated_at: timestamp
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating package status:', error);
        throw error;
      }
      
      // Log the response for debugging
      console.log('Status update response:', data);

      toast({
        title: 'Status Updated',
        description: `Package ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      // Immediately refresh package data after update
      await fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Package Pricing</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || updating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {syncNeeded && (
            <Button
              variant="destructive"
              onClick={handleSyncPackages}
              disabled={updating}
            >
              Sync Package Prices
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            You need admin privileges to make changes to package prices and status.
          </div>
        )}
        
        {syncNeeded && (
          <Alert variant="warning" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Inconsistent pricing detected for the same package. Click "Sync Package Prices" to fix this issue.
            </AlertDescription>
          </Alert>
        )}
        
        <PackageTable
          packages={packages}
          loading={loading}
          updating={updating}
          onEditPrice={handleEditPrice}
          onToggleStatus={handleToggleStatus}
        />
      </CardContent>
    </Card>
  );
};

export default PackagePricing;
