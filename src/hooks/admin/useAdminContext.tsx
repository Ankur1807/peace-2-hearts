
import React, { createContext, useContext } from 'react';
import { AdminContextType } from './types';
import { useAdminStatus } from './useAdminStatus';
import { useAdminAuth } from './useAdminAuth';

// Create context with default undefined value
const AdminContext = createContext<AdminContextType | undefined>(undefined);

/**
 * Hook to access the admin context
 */
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

/**
 * Provider component for admin authentication and status
 */
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  // Use the individual hooks to compose our provider functionality
  const { isAdmin, isAdminChecking } = useAdminStatus();
  const { adminLogin, adminLogout } = useAdminAuth();

  // Combine all the functionality into a single context value
  const value: AdminContextType = {
    isAdmin,
    isAdminChecking,
    adminLogin,
    adminLogout
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
