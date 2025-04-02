
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import PricingTabs from '@/components/admin/PricingTabs';

const PricingManagement = () => {
  const { isAdmin, isAdminChecking, isAuthenticated, loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle form submission
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginAsAdmin(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to pricing management",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error; // Re-throw to let the child component know there was an error
    }
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdminChecking && !isAdmin && isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isAdminChecking, isAuthenticated, navigate, toast]);

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
        title={isAuthenticated ? "Pricing Management - Peace2Hearts Admin" : "Admin Login - Peace2Hearts"}
        description={isAuthenticated ? "Manage service pricing, packages, and discount codes." : "Login to access pricing management"}
      />
      <Navigation />
      
      <main className="py-16 md:py-24">
        {!isAuthenticated ? (
          <AdminLoginForm onSubmit={handleLogin} />
        ) : (
          <PricingTabs />
        )}
      </main>
      
      <Footer />
      <Toaster />
    </>
  );
};

export default PricingManagement;
