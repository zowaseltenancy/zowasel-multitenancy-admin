export type ComparisonUnit = "day" | "week" | "month" | "year";

function isInCurrentPeriod(date: Date, now: Date, unit: ComparisonUnit): boolean {
  if (unit === "day") {
    return date.toDateString() === now.toDateString();
  }

  if (unit === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo && date <= now;
  }

  if (unit === "month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }

  return date.getFullYear() === now.getFullYear();
}

function isInPreviousPeriod(date: Date, now: Date, unit: ComparisonUnit): boolean {
  if (unit === "day") {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  if (unit === "week") {
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= twoWeeksAgo && date < weekAgo;
  }

  if (unit === "month") {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getFullYear() === lastMonth.getFullYear() && date.getMonth() === lastMonth.getMonth();
  }

  return date.getFullYear() === now.getFullYear() - 1;
}

export interface ActivityMetric {
  label: string;
  current: number;
  previous: number;
}

// Counts how many items with a given date field fall in the current vs.
// previous period for a comparison unit — the building block behind the
// Dashboard's rotating Platform Activity card.
export function countInPeriod(dates: string[], unit: ComparisonUnit): { current: number; previous: number } {
  const now = new Date();
  let current = 0;
  let previous = 0;

  for (const iso of dates) {
    const date = new Date(iso);

    if (isInCurrentPeriod(date, now, unit)) {
      current += 1;
    } else if (isInPreviousPeriod(date, now, unit)) {
      previous += 1;
    }
  }

  return { current, previous };
}
