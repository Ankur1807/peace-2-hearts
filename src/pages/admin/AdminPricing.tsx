
import { SEO } from '@/components/SEO';
import PricingTabs from "@/components/admin/PricingTabs";
import { AdminProvider } from "@/hooks/useAdminContext";

const AdminPricing = () => {
  return (
    <>
      <SEO
        title="Pricing Management - Peace2Hearts Admin"
        description="Manage service pricing and packages"
      />
      
      <AdminProvider>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Pricing Management</h1>
          <PricingTabs />
        </div>
      </AdminProvider>
    </>
  );
};

export default AdminPricing;
