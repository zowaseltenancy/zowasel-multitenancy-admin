import { useState, useMemo } from "react";
import { CropItem, CommodityMarketSummary } from "@/types/crop";
import { MOCK_CROPS, LEGACY_CROP_METRICS } from "../data/mockCrops";
import { GeographicFilterState } from "@/types/geo";

export function useCrops(geoFilter?: GeographicFilterState) {
  const [crops] = useState<CropItem[]>(MOCK_CROPS);

  const summary = useMemo<CommodityMarketSummary>(() => {
    // If no specific region is filtered (global scope), return legacy baseline numbers from oldadmindash.png
    if (!geoFilter || (geoFilter.continent === "all" && geoFilter.subRegion === "all" && geoFilter.countryCode === "all")) {
      return LEGACY_CROP_METRICS;
    }

    const filtered = crops.filter((crop) => {
      const matchContinent = geoFilter.continent === "all" || crop.continent === geoFilter.continent;
      const matchSubRegion = geoFilter.subRegion === "all" || crop.subRegion === geoFilter.subRegion;
      const matchCountry = geoFilter.countryCode === "all" || crop.countryCode === geoFilter.countryCode;
      return matchContinent && matchSubRegion && matchCountry;
    });

    return {
      totalCrops: filtered.length,
      cropsForSale: filtered.filter((c) => c.listingType === "sale").length,
      cropsForAuction: filtered.filter((c) => c.listingType === "auction").length,
      wantedCrops: filtered.filter((c) => c.listingType === "wanted").length,
    };
  }, [crops, geoFilter]);

  return {
    crops,
    summary,
  };
}
