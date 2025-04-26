
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
      
      // First check Supabase authentication
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Then check for admin authentication in localStorage
      const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
      const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
      const isSessionValid = adminAuthenticated && (Date.now() - authTime < ADMIN_SESSION_DURATION);
      
      console.log('Admin check - Supabase auth:', !!sessionData.session);
      console.log('Admin check - Local auth:', adminAuthenticated);
      console.log('Admin check - Session valid:', isSessionValid);
      
      // If we have a valid admin session in localStorage
      if (isSessionValid) {
        console.log("Valid admin session found in localStorage");
        setIsAdmin(true);
        setIsAdminChecking(false);
        return;
      }
      
      // If we have a Supabase session, check if the user is an admin
      if (sessionData.session) {
        const adminStatus = await checkSuperbaseAdminStatus();
        console.log("Checked Supabase admin status:", adminStatus);
        
        if (adminStatus) {
          // Store the admin status in localStorage
          localStorage.setItem('p2h_admin_authenticated', 'true');
          localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
          setIsAdmin(true);
          setIsAdminChecking(false);
          return;
        }
      }
      
      // Check stored API key if no valid session
      const storedKey = localStorage.getItem('admin_api_key');
      if (storedKey) {
        try {
          const { data, error } = await supabase.functions.invoke('admin-auth', {
            body: { apiKey: storedKey }
          });

          if (!error && data?.success) {
            // Set admin session
            localStorage.setItem('p2h_admin_authenticated', 'true');
            localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
            setIsAdmin(true);
            setIsAdminChecking(false);
            return;
          } else {
            console.error('API key validation failed:', error || data?.error);
            localStorage.removeItem('admin_api_key');
          }
        } catch (error) {
          console.error("Error checking stored API key:", error);
        }
      }
      
      // If we reach here, the user is not authenticated as admin
      setIsAdmin(false);
      
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsAdminChecking(false);
    }
  };

  // Check if the user is an admin via Supabase
  const checkSuperbaseAdminStatus = async (): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      
      // Pre-approved admin emails list
      const adminEmails = [
        'admin@peace2hearts.com', 
        'founder@peace2hearts.com',
        'ankurb@peace2hearts.com'
      ];
      
      return adminEmails.includes(userData.user.email || '');
    } catch (error) {
      console.error('Error checking Supabase admin status:', error);
      return false;
    }
  };

  const adminLogin = async (apiKey: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAdminChecking(true);
      
      // Try to validate the API key
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { apiKey }
      });

      if (error || !data?.success) {
        throw new Error('Invalid API key');
      }

      // Store API key and set admin session
      localStorage.setItem('admin_api_key', apiKey);
      localStorage.setItem('p2h_admin_authenticated', 'true');
      localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
      
      setIsAdmin(true);
      setIsAdminChecking(false);
      return { success: true };
    } catch (error: any) {
      console.error('Authentication error:', error);
      setIsAdminChecking(false);
      return { 
        success: false, 
        error: error.message || "Authentication failed" 
      };
    }
  };

  const adminLogout = async (): Promise<void> => {
    // Clear all admin authentication data
    localStorage.removeItem('admin_api_key');
    localStorage.removeItem('p2h_admin_authenticated');
    localStorage.removeItem('p2h_admin_auth_time');
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
    
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
