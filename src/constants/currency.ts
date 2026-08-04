// Single source of truth for the exchange-rate markup ceiling — global,
// regional, and per-country markup inputs must all agree on this bound.
export const MAX_MARKUP_PERCENTAGE = 20;
export const MIN_MARKUP_PERCENTAGE = 0;

export function clampMarkup(value: number): number {
  if (Number.isNaN(value)) return MIN_MARKUP_PERCENTAGE;
  return Math.min(MAX_MARKUP_PERCENTAGE, Math.max(MIN_MARKUP_PERCENTAGE, value));
}
