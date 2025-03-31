
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ServicePricingTable from "@/components/pricing/ServicePricingTable";
import PackagePricingTable from "@/components/pricing/PackagePricingTable";
import DiscountCodesTable from "@/components/pricing/DiscountCodesTable";
import PricingHistoryTable from "@/components/pricing/PricingHistoryTable";
import AdminLoader from "@/components/consultants/ConsultantLoader";

const AdminPricing = () => {
  const { isAdmin, isAdminChecking } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<string>("services");
  const { toast } = useToast();

  if (isAdminChecking) {
    return <AdminLoader />;
  }

  if (!isAdmin) {
    return null; // The useAdminAuth hook will redirect non-admins
  }

  return (
    <>
      <SEO 
        title="Admin Pricing Management - Peace2Hearts"
        description="Manage service pricing, packages, and discount codes for Peace2Hearts platform."
      />
      <Navigation />
      <main className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="section-title text-4xl md:text-5xl text-center mb-8">Pricing Management</h1>
          
          <div className="space-y-6 max-w-6xl mx-auto">
            <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
                <TabsTrigger value="history">Price History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="space-y-4">
                <ServicePricingTable />
              </TabsContent>
              
              <TabsContent value="packages" className="space-y-4">
                <PackagePricingTable />
              </TabsContent>
              
              <TabsContent value="discounts" className="space-y-4">
                <DiscountCodesTable />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <PricingHistoryTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminPricing;
