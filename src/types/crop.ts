export type CropListingType = "sale" | "auction" | "wanted";

export interface CropItem {
  id: string;
  name: string;
  category: "grains" | "cash_crops" | "vegetables" | "fruits";
  listingType: CropListingType;
  volumeMt: number;
  pricePerUnit: number;
  unit: "MT" | "Kg" | "Bags";
  continent: string;
  subRegion: string;
  countryCode: string;
}

export interface CommodityMarketSummary {
  totalCrops: number;
  cropsForSale: number;
  cropsForAuction: number;
  wantedCrops: number;
}
