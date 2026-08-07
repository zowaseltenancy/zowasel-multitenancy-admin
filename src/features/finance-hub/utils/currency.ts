import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

// Reuses the platform's one real FX rate table (src/data/geoData.ts) —
// no second, independently-invented conversion rate anywhere in Finance Hub.
export function fxRateToUSD(currencyCode: string): number {
  if (currencyCode === "USD") return 1;
  const match = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.currencyCode === currencyCode);
  return match?.baseRateToUSD ?? 1;
}

export function convertToUSD(amount: number, currencyCode: string): number {
  return amount / fxRateToUSD(currencyCode);
}

export function currencySymbolFor(currencyCode: string): string {
  if (currencyCode === "USD") return "$";
  const match = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.currencyCode === currencyCode);
  return match?.currencySymbol ?? currencyCode;
}

// Best-effort country for a currency (first matching country in the table) —
// used to scope ledger entries that don't carry an explicit countryCode
// (e.g. billing-derived transactions, which only ever record a currency).
// Imprecise for shared currencies (XOF, etc.) but exact for the 3 countries
// Zowasel's Finance officers actually operate in today (NGN/KES/TZS).
export function countryForCurrency(currencyCode: string): string | undefined {
  if (currencyCode === "USD") return undefined;
  return GLOBAL_COUNTRY_CURRENCIES.find((c) => c.currencyCode === currencyCode)?.countryCode;
}

export function formatUSD(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatNative(amount: number, symbol: string): string {
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}
