
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from './AdminSidebar';
import AdminLoginForm from './AdminLoginForm';
import { SEO } from '@/components/SEO';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { isAdmin, isAdminChecking, isAuthenticated, loginAsAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Handle login form submission
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginAsAdmin(email, password);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin portal"
      });
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error;
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
        title={`${title} - Peace2Hearts Admin Portal`}
        description={description || "Peace2Hearts admin portal for managing consultants, pricing, and bookings."}
      />
      
      {!isAuthenticated || !isAdmin ? (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-6">Peace2Hearts Admin Portal</h1>
            <AdminLoginForm onSubmit={handleLogin} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex">
          <AdminSidebar />
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              <h1 className="text-3xl font-bold mb-6">{title}</h1>
              {children}
            </main>
          </div>
        </div>
      )}
      
      <Toaster />
    </>
  );
};

export default AdminLayout;
