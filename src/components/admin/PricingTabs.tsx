
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out"
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-lora font-bold">Pricing Management</h1>
        <Button 
          variant="outline" 
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
      
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
    </div>
  );
};

export default PricingTabs;
