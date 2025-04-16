
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminContextType {
  isAdmin: boolean;
  isAdminChecking: boolean;
  adminLogin: (apiKey: string) => Promise<{ success: boolean; error?: string }>;
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

// Session duration constant (24 hours)
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000;

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsAdminChecking(true);
      const storedKey = localStorage.getItem('admin_api_key');
      const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
      const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
      
      // Check if we have a valid p2h_admin session
      if (adminAuthenticated && (Date.now() - authTime < ADMIN_SESSION_DURATION)) {
        console.log("Valid admin session found");
        setIsAdmin(true);
        setIsAdminChecking(false);
        return;
      }
      
      // If no valid session, check API key
      if (!storedKey) {
        setIsAdmin(false);
        setIsAdminChecking(false);
        return;
      }

      // Verify API key with Supabase function
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { apiKey: storedKey }
      });

      if (error || !data?.success) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        localStorage.removeItem('admin_api_key');
        setIsAdminChecking(false);
        return;
      }

      setIsAdmin(true);
      // Also set the p2h_admin auth flags for consistency
      localStorage.setItem('p2h_admin_authenticated', 'true');
      localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
      
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsAdminChecking(false);
    }
  };

  const adminLogin = async (apiKey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { apiKey }
      });

      if (error || !data?.success) {
        throw new Error('Invalid API key');
      }

      localStorage.setItem('admin_api_key', apiKey);
      localStorage.setItem('p2h_admin_authenticated', 'true');
      localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
      
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
    localStorage.removeItem('admin_api_key');
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
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
