
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import PricingTabs from "@/components/admin/PricingTabs";
import { checkAdminPermission } from '@/utils/pricing/pricingOperations';
import { useToast } from '@/hooks/use-toast';

const AdminPricing = () => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        setIsChecking(true);
        const isAdmin = await checkAdminPermission();
        
        if (!isAdmin) {
          toast({
            title: 'Access Denied',
            description: 'You need administrator privileges to access this page.',
            variant: 'destructive',
          });
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: 'Authentication Error',
          description: 'Could not verify admin privileges. Please log in again.',
          variant: 'destructive',
        });
        navigate('/admin/login');
      } finally {
        setIsChecking(false);
      }
    };
    
    verifyAdminAccess();
  }, [navigate, toast]);
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Pricing Management - Peace2Hearts Admin"
        description="Manage service pricing, packages, and discount codes"
      />
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <PricingTabs />
      </div>
    </>
  );
};

export default AdminPricing;
