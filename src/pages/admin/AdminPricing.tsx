
import { SEO } from '@/components/SEO';
import PricingTabs from "@/components/admin/PricingTabs";

const AdminPricing = () => {
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
