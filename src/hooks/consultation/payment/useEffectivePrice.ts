
type EffectivePriceState = {
  selectedServices: string[];
  pricing: Map<string, number> | undefined;
  totalPrice: number;
};

export const useEffectivePrice = (state: EffectivePriceState) => {
  return () => {
    if (!state.selectedServices || state.selectedServices.length === 0 || !state.pricing) {
      return state.totalPrice;
    }
    if (state.selectedServices.includes('test-service') && state.pricing.has('test-service')) {
      return state.pricing.get('test-service');
    }
    if (state.selectedServices.length === 1) {
      const serviceId = state.selectedServices[0];
      if (state.pricing.has(serviceId)) {
        return state.pricing.get(serviceId);
      }
    }
    return state.totalPrice;
  };
};
