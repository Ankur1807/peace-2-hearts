
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Importing our components
import ServicePricing from '@/components/pricing/ServicePricing';
import PackagePricing from '@/components/pricing/PackagePricing';
import DiscountCodes from '@/components/pricing/DiscountCodes';
import PricingHistory from '@/components/pricing/PricingHistory';

const PricingManagement = () => {
  const { isAdmin, isAdminChecking } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('services');
  
  // Redirect non-admin users
  useEffect(() => {
    if (!isAdminChecking && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isAdminChecking, navigate, toast]);

  if (isAdminChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-peacefulBlue"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Pricing Management - Peace2Hearts Admin"
        description="Manage service pricing, packages, and discount codes."
        noIndex={true}
      />
      <Navigation />
      
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-lora font-bold text-center mb-12">Pricing Management</h1>
          
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
      </main>
      
      <Footer />
      <Toaster />
    </>
  );
};

export default PricingManagement;
