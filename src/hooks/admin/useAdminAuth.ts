
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthResult } from "./types";
import { validateApiKey, setAdminAuthData, clearAdminAuthData } from "./adminUtils";

// Admin status cache
let adminStatusCache: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

  /**
   * Check admin status using server verification
   */
  const checkAdminStatus = async (): Promise<boolean> => {
    try {
      // Check cache first
      if (adminStatusCache && (Date.now() - adminStatusCache.timestamp) < CACHE_DURATION) {
        return adminStatusCache.isAdmin;
      }

      const { data, error } = await supabase.functions.invoke('admin-status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      const isAdmin = data?.is_admin || false;
      
      // Update cache
      adminStatusCache = {
        isAdmin,
        timestamp: Date.now()
      };

      return isAdmin;
    } catch (error) {
      console.error('Admin status check failed:', error);
      return false;
    }
  };

  return {
    adminLogin,
    adminLogout,
    isAdminChecking,
    checkAdminStatus,
  };
};
