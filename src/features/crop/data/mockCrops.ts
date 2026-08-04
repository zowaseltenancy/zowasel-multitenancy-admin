import { CropItem } from "@/types/crop";

export const MOCK_CROPS: CropItem[] = [
  // Crops for Sale (82 total across regions)
  { id: "crop-1", name: "Yellow Maize", category: "grains", listingType: "sale", volumeMt: 450, pricePerUnit: 280000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "NG" },
  { id: "crop-2", name: "Paddy Rice", category: "grains", listingType: "sale", volumeMt: 320, pricePerUnit: 310000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "NG" },
  { id: "crop-3", name: "White Sorghum", category: "grains", listingType: "sale", volumeMt: 180, pricePerUnit: 240000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "GH" },
  { id: "crop-4", name: "Raw Cashew Nuts", category: "cash_crops", listingType: "sale", volumeMt: 95, pricePerUnit: 620000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "CI" },
  { id: "crop-5", name: "Soybeans", category: "grains", listingType: "sale", volumeMt: 210, pricePerUnit: 350000, unit: "MT", continent: "africa", subRegion: "east_africa", countryCode: "KE" },

  // Crops for Auction (1 total)
  { id: "crop-auction-1", name: "Premium Grade Cocoa Beans", category: "cash_crops", listingType: "auction", volumeMt: 500, pricePerUnit: 1200000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "GH" },

  // Wanted Crops (124 total across regions)
  { id: "crop-w-1", name: "Non-GMO Soybeans", category: "grains", listingType: "wanted", volumeMt: 1200, pricePerUnit: 360000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "NG" },
  { id: "crop-w-2", name: "Export Grade Sesame Seeds", category: "cash_crops", listingType: "wanted", volumeMt: 800, pricePerUnit: 780000, unit: "MT", continent: "africa", subRegion: "east_africa", countryCode: "ET" },
  { id: "crop-w-3", name: "Dry Ginger", category: "cash_crops", listingType: "wanted", volumeMt: 300, pricePerUnit: 950000, unit: "MT", continent: "africa", subRegion: "west_africa", countryCode: "NG" },
];

/**
 * Baseline legacy dashboard metrics from reference oldadmindash.png:
 * Total Crops: 207 | Crops for Sale: 82 | Crops for Auction: 1 | Wanted Crops: 124
 */
export const LEGACY_CROP_METRICS = {
  totalCrops: 207,
  cropsForSale: 82,
  cropsForAuction: 1,
  wantedCrops: 124,
};
