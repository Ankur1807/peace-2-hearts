
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePrice } from '@/utils/pricingTypes';
import PackageTable from './PackageTable';

const PackagePricing = () => {
  const [packages, setPackages] = useState<PackagePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('package_pricing')
        .select('*');

      if (error) {
        console.error('Error fetching packages:', error);
        throw error;
      }

      setPackages(data || []);
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

  const handleEditPrice = async (id: string, price: number) => {
    try {
      const { error } = await supabase
        .from('package_pricing')
        .update({ 
          price, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Price Updated',
        description: 'Package price has been successfully updated.',
      });

      fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update price: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('package_pricing')
        .update({ 
          is_active: !currentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Package ${currentStatus ? 'deactivated' : 'activated'} successfully.`,
      });

      fetchPackages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Pricing</CardTitle>
      </CardHeader>
      <CardContent>
        <PackageTable
          packages={packages}
          loading={loading}
          onEditPrice={handleEditPrice}
          onToggleStatus={handleToggleStatus}
        />
      </CardContent>
    </Card>
  );
};

export default PackagePricing;
