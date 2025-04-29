
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthResult } from "./types";
import { validateApiKey, setAdminAuthData, clearAdminAuthData } from "./adminUtils";

/**
 * Hook for admin authentication operations
 */
export const useAdminAuth = () => {
  const [isAdminChecking, setIsAdminChecking] = useState(false);

  /**
   * Login as admin using API key
   */
  const adminLogin = async (apiKey: string): Promise<AdminAuthResult> => {
    try {
      setIsAdminChecking(true);
      
      const isValidKey = await validateApiKey(apiKey);
      
      if (!isValidKey) {
        throw new Error('Invalid API key');
      }

      // Store API key and set admin session
      setAdminAuthData(apiKey);
      
      return { success: true };
    } catch (error: any) {
      console.error('Authentication error:', error);
      return { 
        success: false, 
        error: error.message || "Authentication failed" 
      };
    } finally {
      setIsAdminChecking(false);
    }
  };

  /**
   * Logout from admin session
   */
  const adminLogout = async (): Promise<void> => {
    // Clear all admin authentication data
    clearAdminAuthData();
    
    // Also sign out from Supabase
    await supabase.auth.signOut();
  };

  return {
    adminLogin,
    adminLogout,
    isAdminChecking,
  };
};
