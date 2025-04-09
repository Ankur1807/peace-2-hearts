
/**
 * This file is maintained for backward compatibility.
 * It re-exports all service operations from their respective modules.
 */

import { fetchAllServices } from './serviceQueries';
import { updateServicePrice, toggleServiceActive, createService, removeService } from './serviceCommands';
import { fetchInitialServices, addInitialServices } from './serviceInitializer';

export {
  fetchAllServices,
  fetchInitialServices,
  updateServicePrice,
  toggleServiceActive,
  createService,
  removeService,
  addInitialServices
};
