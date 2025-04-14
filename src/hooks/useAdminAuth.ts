
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsAdminChecking(true);
        // First check if user is authenticated via Supabase
        const { data } = await supabase.auth.getSession();
        
        // Then check if admin status is set in localStorage from edge function auth
        const adminAuthenticated = localStorage.getItem('p2h_admin_authenticated');
        const adminAuthTime = localStorage.getItem('p2h_admin_auth_time');
        
        // Admin auth is valid if set in last 24 hours
        const isAdminAuthValid = adminAuthenticated === 'true' && 
          adminAuthTime && 
          (Date.now() - parseInt(adminAuthTime)) < 24 * 60 * 60 * 1000;
        
        if (data.session) {
          setIsAuthenticated(true);
        } else if (isAdminAuthValid) {
          // If we have valid admin auth in localStorage but no Supabase session
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }
        
        // If we reach here, user is authenticated one way or another
        // Check if they're an admin
        if (isAdminAuthValid) {
          setIsAdmin(true);
        } else {
          const adminStatus = await checkIsAdmin();
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setIsAuthenticated(false);
      } finally {
        setIsAdminChecking(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      () => {
        checkAdminStatus();
      }
    );

    checkAdminStatus();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Manual login for admins - uses edge function for authentication
  const loginAsAdmin = async (email: string, password: string) => {
    try {
      // Call the admin-auth edge function
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: {
          email,
          password
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Authentication failed');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Invalid email or password');
      }

      // Set a session marker in localStorage
      localStorage.setItem('p2h_admin_authenticated', 'true');
      localStorage.setItem('p2h_admin_auth_time', Date.now().toString());
      
      // Set authentication state immediately (don't wait for effect)
      setIsAuthenticated(true);
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

  return { isAdmin, isAdminChecking, isAuthenticated, loginAsAdmin };
};

// Helper function to check admin status (can be expanded later)
const checkIsAdmin = async (): Promise<boolean> => {
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
    console.error('Error checking admin status:', error);
    return false;
  }
};
