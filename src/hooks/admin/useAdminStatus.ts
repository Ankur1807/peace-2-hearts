
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkSupabaseAdminStatus, validateApiKey, ADMIN_SESSION_DURATION } from "./adminUtils";

/**
 * Hook to check and monitor admin status
 */
export const useAdminStatus = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecking, setIsAdminChecking] = useState(true);

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

  return {
    isAdmin,
    isAdminChecking,
    checkAdminStatus
  };
};
