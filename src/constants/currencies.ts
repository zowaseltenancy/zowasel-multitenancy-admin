import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

// A deduplicated currency list derived from the real 200-country/144-currency
// dataset that already backs the region-scope filter (src/data/geoData.ts) —
// deliberately not a second, hand-typed currency dataset that could drift
// out of sync with it. Several countries share a currency (e.g. XOF across
// West Africa), so this collapses to one row per currency code.
export interface WorldCurrency {
  code: string;
  name: string;
  symbol: string;
  usdRate: number; // units of this currency per 1 USD
}

export const WORLD_CURRENCIES: WorldCurrency[] = Array.from(
  GLOBAL_COUNTRY_CURRENCIES.reduce((map, c) => {
    if (!map.has(c.currencyCode)) {
      map.set(c.currencyCode, { code: c.currencyCode, name: c.currencyName, symbol: c.currencySymbol, usdRate: c.baseRateToUSD });
    }
    return map;
  }, new Map<string, WorldCurrency>()).values()
).sort((a, b) => a.code.localeCompare(b.code));

export function findCurrency(code: string): WorldCurrency {
  const found = WORLD_CURRENCIES.find((c) => c.code === code);
  if (!found) throw new Error(`Unknown currency code: ${code}`);
  return found;
}

// Cross rate via USD as the vehicle currency: how many units of `to` you get
// for 1 unit of `from`. Standard FX math — avoids needing a full pair-by-pair
// matrix for 144 currencies.
export function getCrossRate(fromCode: string, toCode: string): number {
  const from = findCurrency(fromCode);
  const to = findCurrency(toCode);
  return to.usdRate / from.usdRate;
}
