import { CropListingType } from "@/types/crop";

export const CROP_LISTING_TYPE_LABELS: Record<CropListingType, string> = {
  sale: "For Sale",
  auction: "For Auction",
  wanted: "Wanted Crops",
};

export const CROP_LISTING_TYPE_COLORS: Record<CropListingType, string> = {
  sale: "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400",
  auction: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  wanted: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
};
