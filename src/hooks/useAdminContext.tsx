
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface AdminContextType {
  isAdmin: boolean;
  isAdminChecking: boolean;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsAdminChecking(true);
      
      // Check if admin status is set in localStorage
      const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated');
      const adminAuthTime = localStorage.getItem('p2h_admin_auth_time');
      
      // Admin auth is valid if set in last 24 hours
      const isAdminAuthValid = adminAuthenticated === 'true' && 
        adminAuthTime && 
        (Date.now() - parseInt(adminAuthTime)) < 24 * 60 * 60 * 1000;
      
      setIsAdmin(isAdminAuthValid);
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsAdminChecking(false);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Call the admin-auth edge function
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { email, password }
      });
      
      if (error) {
        throw new Error(error.message || 'Authentication failed');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Set a session marker in localStorage
      localStorage.setItem('p2h_admin_authenticated', 'true');
      localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
      
      // Update state immediately
      setIsAdmin(true);
      
      return { success: true };
    } catch (error: any) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        error: error.message || "Authentication failed" 
      };
    }
  };

  const adminLogout = async (): Promise<void> => {
    // Clear admin auth from localStorage
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
    
    // Update state
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    isAdminChecking,
    adminLogin,
    adminLogout
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
