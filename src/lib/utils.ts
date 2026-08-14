import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats dashboard metrics into compact representation:
 * - Billions: e.g. 12B, 1.5B
 * - Millions: e.g. 12M, 14.2M
 * - Thousands: e.g. 12k, 1.5k
 * - Below 1,000: standard number (e.g. 450)
 */
export function formatCompactMetric(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "0";
  const numVal = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(numVal)) return "0";

  const abs = Math.abs(numVal);
  const sign = numVal < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    const formatted = (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}B`;
  }
  if (abs >= 1_000_000) {
    const formatted = (abs / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}M`;
  }
  if (abs >= 1_000) {
    const formatted = (abs / 1_000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}k`;
  }
  return `${sign}${abs.toLocaleString()}`;
}
