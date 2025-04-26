
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { checkIsAdmin } from '@/utils/authUtils';
import { useAdmin } from '@/hooks/useAdminContext';

// Importing our components
import ServicePricing from '@/components/pricing/ServicePricing';
import PackagePricing from '@/components/pricing/PackagePricing';
import DiscountCodes from '@/components/pricing/DiscountCodes';
import PricingHistory from '@/components/pricing/PricingHistory';

interface PricingTabsProps {
  defaultTab?: string;
}

const PricingTabs = ({ defaultTab = 'services' }: PricingTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { toast } = useToast();
  const { isAdmin, isAdminChecking, adminLogout } = useAdmin();

  // Use admin context instead of local state for authentication status
  const handleSignOut = async () => {
    await adminLogout();
    
    toast({
      title: "Signed out",
      description: "You have been signed out"
    });
  };

  if (isAdminChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-peacefulBlue" />
        <span className="ml-2 text-lg">Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Pricing Management</h1>
        <div className="flex items-center gap-2">
          <div className="text-sm mr-2">
            {isAdmin ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Admin Access: Active</span>
            ) : (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Admin Access: Inactive</span>
            )}
          </div>
          {isAdmin && (
            <Button 
              variant="outline" 
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
      
      {!isAdmin ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-amber-800 mb-2">Admin Authentication Required</h2>
          <p className="text-amber-700 mb-4">
            You need administrator privileges to manage pricing. Please sign in using the admin login page.
          </p>
          <Button 
            variant="default" 
            onClick={() => window.location.href = "/admin/login"}
          >
            Go to Admin Login
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="py-8">
            <ServicePricing />
          </TabsContent>
          
          <TabsContent value="packages" className="py-8">
            <PackagePricing />
          </TabsContent>
          
          <TabsContent value="discounts" className="py-8">
            <DiscountCodes />
          </TabsContent>
          
          <TabsContent value="history" className="py-8">
            <PricingHistory />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PricingTabs;
