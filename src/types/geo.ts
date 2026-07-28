export type Continent = "all" | "africa" | "americas" | "europe" | "asia" | "oceania";

export type SubRegion =
  | "all"
  // Africa
  | "west_africa"
  | "east_africa"
  | "north_africa"
  | "southern_africa"
  | "central_africa"
  // Americas
  | "north_america"
  | "south_america"
  | "central_america"
  | "caribbean"
  // Europe
  | "western_europe"
  | "eastern_europe"
  | "northern_europe"
  | "southern_europe"
  // Asia
  | "east_asia"
  | "south_asia"
  | "southeast_asia"
  | "middle_east"
  | "central_asia"
  // Oceania & Polar
  | "australasia"
  | "pacific_islands"
  | "antarctica";

export interface CountryCurrency {
  countryCode: string;
  countryName: string;
  continent: Continent;
  subRegion: SubRegion;
  subRegionName: string;
  flag: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  baseRateToUSD: number;
  markupPercentage: number; // Base or default country markup
  customMarkupPercentage?: number; // Settable individual country override
  useRegionalMarkup?: boolean; // Whether regional markup is applied (default: true)
  papssSupported: boolean;
  isDefaultPlatformCurrency?: boolean;
}

export interface GeographicFilterState {
  scope: "global" | "continental" | "regional" | "country";
  continent: Continent;
  subRegion: SubRegion;
  countryCode: string;
}
