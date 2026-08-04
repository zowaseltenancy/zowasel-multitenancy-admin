import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  danger:
    "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
  info:
    "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  neutral:
    "bg-muted text-muted-foreground border-border",
};

const TONE_DOT_CLASSES: Record<StatusTone, string> = {
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  danger: "bg-red-600",
  info: "bg-blue-600",
  neutral: "bg-muted-foreground",
};

/**
 * Single source of truth for status colors app-wide (KYB, users, providers,
 * currencies, transactions, invoices, settlements, subscriptions). Keeps
 * "good/complete", "pending/warning" and "issue/failed" states visually
 * identical everywhere instead of each badge inventing its own palette.
 */
export function statusBadgeClass(tone: StatusTone, urgent = false) {
  return cn(
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
    TONE_CLASSES[tone],
    urgent && "font-bold shadow-xs animate-pulse"
  );
}

export function statusDotClass(tone: StatusTone) {
  return cn("h-1.5 w-1.5 shrink-0 rounded-full", TONE_DOT_CLASSES[tone]);
}

// Solid background fill for a tone — used for segmented/stacked bar
// segments, where the dot's color carries through at a larger scale.
export function statusFillClass(tone: StatusTone) {
  return TONE_DOT_CLASSES[tone];
}
