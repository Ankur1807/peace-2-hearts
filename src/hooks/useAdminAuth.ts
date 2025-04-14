
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin } from "@/utils/authUtils";
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
        // First check if user is authenticated
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setIsAdmin(false);
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
        
        // Then check if user is admin
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
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

  // Manual login for admins - bypasses email confirmation
  const loginAsAdmin = async (email: string, password: string) => {
    try {
      // List of pre-approved admin emails
      const preApprovedAdmins = ['ankurb@peace2hearts.com'];
      const isPreApprovedAdmin = preApprovedAdmins.includes(email);
      
      if (!isPreApprovedAdmin) {
        // Regular login for non-pre-approved admins
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
      } else {
        // Special login path for pre-approved admins using signUp to force a session
        // This bypasses email confirmation
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              admin: true
            }
          }
        });
        
        // If user already exists, try direct login
        if (error && error.message.includes("already exists")) {
          await supabase.auth.signInWithPassword({
            email,
            password
          });
        } else if (error) {
          throw error;
        }
        
        // Force authenticated state for pre-approved admins
        setIsAuthenticated(true);
        setIsAdmin(true);
      }
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || "Authentication failed" 
      };
    }
  };

  return { isAdmin, isAdminChecking, isAuthenticated, loginAsAdmin };
};
