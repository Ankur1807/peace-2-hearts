
// Re-export from individual modules
export * from './services/priceManager';
export * from './services/serviceManager';
export * from './packages/packageManager';

// Export from serviceCommands with explicit names to avoid conflicts
export {
  updatePackagePrice as cmdUpdatePackagePrice,
  syncPackageIds as cmdSyncPackageIds,
  updateServicePrice as cmdUpdateServicePrice,
  toggleServiceActive as cmdToggleServiceActive,
  createService as cmdCreateService,
  removeService as cmdRemoveService
} from './serviceCommands';

// Export from serviceQueries with explicit names to avoid conflicts
export {
  fetchAllServices as queryFetchAllServices
} from './serviceQueries';
