
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePrice } from '@/utils/pricingTypes';
import PackageTable from './PackageTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdminContext';

const PackagePricing = () => {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  const fetchPackages = async (showMessage = false) => {
    try {
      setLoading(true);
      console.log('Fetching packages from Supabase...');
      
      const { data, error } = await supabase
        .from('package_pricing')
        .select('*');

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
      const timestamp = new Date().toISOString();
      console.log(`Updating package ID ${id} with new price: ${price} at ${timestamp}`);
      
      if (!isAdmin) {
        throw new Error("You don't have admin permission to update prices");
      }
      
      const { data, error } = await supabase
        .from('package_pricing')
        .update({ 
          price, 
          updated_at: timestamp
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating package price:', error);
        throw error;
      }

      // Log the response for debugging
      console.log('Update response:', data);
      
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
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || updating}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
            You need admin privileges to make changes to package prices and status.
          </div>
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
