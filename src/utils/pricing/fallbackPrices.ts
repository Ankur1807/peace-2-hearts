
// 🚧 Temporary fallback pricing — remove after Supabase pricing migration (ETA: May 20)

export const fallbackPrices: Record<string, number> = {
  // 🧠 Mental Health Services
  'P2H-MH-sexual-health-counselling': 2200,
  'P2H-MH-couples-counselling': 2500,
  'P2H-MH-family-therapy': 2500,
  'P2H-MH-test-service': 11,
  'P2H-MH-mental-health-counselling': 1500,

  // ⚖️ Legal Services
  'P2H-L-mediation-services': 4000,
  'P2H-L-maintenance-consultation': 2500,
  'P2H-L-child-custody-consultation': 2500,
  'P2H-L-divorce-consultation': 2200,
  'P2H-L-general-legal-consultation': 1500,

  // 🌿 Holistic Packages
  'P2H-H-pre-marriage-clarity-solutions': 5000,
  'P2H-H-divorce-prevention-package': 8700,
};

export function getFallbackPrice(serviceId: string): number | undefined {
  return fallbackPrices[serviceId];
}

export function getCategoryFallbackPrices(prefix: string): Record<string, number> {
  const result: Record<string, number> = {};
  Object.entries(fallbackPrices).forEach(([serviceId, price]) => {
    if (serviceId.startsWith(prefix)) {
      result[serviceId] = price;
    }
  });
  return result;
}
