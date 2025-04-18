
/**
 * This file consolidates all service operations into a single module.
 * It re-exports all service operations from their respective modules.
 */

import { fetchAllServices, fetchServiceById } from './serviceQueries';
import { 
  updateServicePrice, 
  toggleServiceActive, 
  createService, 
  removeService,
  updatePackagePrice,
  syncPackageIds
} from './serviceCommands';
import { fetchInitialServices, addInitialServices } from './serviceInitializer';

export {
  fetchAllServices,
  fetchServiceById,
  fetchInitialServices,
  updateServicePrice,
  toggleServiceActive,
  createService,
  removeService,
  addInitialServices,
  updatePackagePrice,
  syncPackageIds
};
