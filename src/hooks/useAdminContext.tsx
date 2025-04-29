
// This file is maintained for backward compatibility
// It re-exports everything from the new admin context module

import { useAdmin, AdminProvider } from './admin/useAdminContext';
import type { AdminContextType } from './admin/types';

export { useAdmin, AdminProvider };
export type { AdminContextType };
