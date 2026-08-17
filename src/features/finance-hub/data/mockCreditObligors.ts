export interface CreditObligor {
  id: string;
  name: string;
  segment: string;
  disbursedUSD: number;
  nplStatus: string;
  riskRating: string;
  collateralRatio: number;
  disbursedAt: string;
}

// Shared by Analytics' Credit & Alternative Finance tab and Accounts
// Monitoring's Off-Taker Credit & Collateral tab — both used to show two
// different sets of numbers for the same underlying concept (one real, one
// hardcoded copy-paste); this is the single real source now.
export const mockCreditObligors: CreditObligor[] = [
  { id: "obl_01", name: "Olam Grains West Africa", segment: "Corporate Processor", disbursedUSD: 850000, nplStatus: "Performing", riskRating: "AAA", collateralRatio: 160, disbursedAt: "2026-06-10" },
  { id: "obl_02", name: "Flour Mills of Nigeria Plc", segment: "Corporate Processor", disbursedUSD: 620000, nplStatus: "Performing", riskRating: "AAA", collateralRatio: 180, disbursedAt: "2026-06-22" },
  { id: "obl_03", name: "Riverbend Farmers Union", segment: "Cooperative Union", disbursedUSD: 310000, nplStatus: "Performing", riskRating: "AA", collateralRatio: 140, disbursedAt: "2026-07-08" },
  { id: "obl_04", name: "Kano Commodity Aggregators", segment: "Grain Aggregator", disbursedUSD: 220000, nplStatus: "Watchlist (>30 Days)", riskRating: "BB", collateralRatio: 110, disbursedAt: "2026-07-15" },
  { id: "obl_05", name: "Rift Valley Grain Producers", segment: "Regional Cooperative", disbursedUSD: 180000, nplStatus: "Performing", riskRating: "A", collateralRatio: 135, disbursedAt: "2026-07-30" },
];
