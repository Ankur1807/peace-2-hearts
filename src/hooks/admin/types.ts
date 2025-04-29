
import { User } from "@supabase/supabase-js";

export interface AdminAuthResult {
  success: boolean;
  error?: string;
}

export interface AdminContextType {
  isAdmin: boolean;
  isAdminChecking: boolean;
  adminLogin: (apiKey: string) => Promise<AdminAuthResult>;
  adminLogout: () => Promise<void>;
}
