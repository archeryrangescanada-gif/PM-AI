import materialPrices from '../data/material_prices.json';

// Build a flat lookup map for quick price reference
const PRICE_LOOKUP: Record<string, {price: number, store: string, unit: string}> = {};
(function buildLookup() {
  function processItems(items: any[]) {
    items.forEach(item => {
      PRICE_LOOKUP[item.item.toLowerCase()] = { price: item.price, store: item.store, unit: item.unit };
    });
  }
  Object.entries(materialPrices).forEach(([cat, val]: [string, any]) => {
    if (cat.startsWith('_')) return;
    if (Array.isArray(val)) processItems(val);
    else if (typeof val === 'object') {
      Object.values(val).forEach((sub: any) => { if (Array.isArray(sub)) processItems(sub); });
    }
  });
})();

export function lookupMaterialPrice(item: string): { price: number; store: string; unit: string } | null {
  const key = item.toLowerCase();
  for (const [k, v] of Object.entries(PRICE_LOOKUP)) {
    if (k.includes(key) || key.includes(k)) return v;
  }
  return null;
}

export interface AIEstimate {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  estimatedCostMax: number;
  analysis: string;
  estimatedTime: string;
  tier: number;
  confidence: number;
  permitRequired: boolean;
}

export async function analyzeMaintenanceRequest(
  title: string,
  description: string,
  photos: string[] = []
): Promise<AIEstimate> {
  try {
    const response = await fetch('/api/analyze-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        photoCount: photos.length,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('HPM analysis failed:', error);
    return {
      category: 'general',
      priority: 'medium',
      estimatedCost: 100,
      estimatedCostMax: 300,
      analysis: 'HPM analysis unavailable. Manual review required by coordinator.',
      estimatedTime: 'TBD',
      tier: 2,
      confidence: 3,
      permitRequired: false,
    };
  }
}
