
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

  // Check admin status on mount
  useEffect(() => {
    checkAdminStatus();
    
    // Check admin status every 5 minutes to ensure session remains valid
    const intervalId = setInterval(checkAdminStatus, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const checkAdminStatus = async () => {
    try {
      setIsAdminChecking(true);
      
      // First check for admin authentication in localStorage
      const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated') === 'true';
      const authTime = parseInt(localStorage.getItem('p2h_admin_auth_time') || '0', 10);
      const isSessionValid = adminAuthenticated && (Date.now() - authTime < ADMIN_SESSION_DURATION);
      
      console.log('Admin check - Local auth:', adminAuthenticated);
      console.log('Admin check - Session valid:', isSessionValid);
      
      // If we have a valid admin session in localStorage
      if (isSessionValid) {
        console.log("Valid admin session found in localStorage");
        setIsAdmin(true);
        setIsAdminChecking(false);
        return;
      }
      
      // If no valid session in localStorage, check Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Admin check - Supabase auth:', !!sessionData.session);
      
      if (sessionData.session) {
        const adminStatus = await checkSupabaseAdminStatus();
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
          const validationResult = await validateApiKey(storedKey);
          
          if (validationResult) {
            // Set admin session
            localStorage.setItem('p2h_admin_authenticated', 'true');
            localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
            setIsAdmin(true);
            setIsAdminChecking(false);
            return;
          } else {
            // Clear invalid API key
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
  
  // Added separate function to validate API key
  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { apiKey }
      });

      if (!error && data?.success) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("API key validation error:", error);
      return false;
    }
  };

  // Check if the user is an admin via Supabase
  const checkSupabaseAdminStatus = async (): Promise<boolean> => {
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
      
      const isValidKey = await validateApiKey(apiKey);
      
      if (!isValidKey) {
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
