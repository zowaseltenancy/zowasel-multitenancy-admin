export type CurrencyRegion = "Africa" | "Global";

export type CurrencyRole =
  | "Operational"
  | "Settlement";

export interface Currency {
  id: string;

  code: string;

  name: string;

  symbol: string;

  region: CurrencyRegion;

  role: CurrencyRole;

  enabled: boolean;

  isDefault: boolean;

  exchangeRate: number;

  decimals: number;

  lastUpdated: string;
}