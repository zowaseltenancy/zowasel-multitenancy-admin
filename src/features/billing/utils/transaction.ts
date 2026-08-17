import { Transaction } from "@/types/transaction";
import { ORGANIZATION_TYPE_LABELS } from "@/constants/organization";
import { ExportTable } from "@/lib/export";

export type TransactionTimeframe =
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export interface CustomRange {
  start: string;

  end: string;
}

export function matchesTimeframe(
  dateIso: string,
  timeframe: TransactionTimeframe,
  customRange?: CustomRange
): boolean {
  const date = new Date(dateIso);
  const now = new Date();

  if (timeframe === "custom" || (customRange && (customRange.start || customRange.end))) {
    if (customRange?.start) {
      const start = new Date(customRange.start);
      if (date < start) return false;
    }
    if (customRange?.end) {
      const end = new Date(customRange.end);
      end.setHours(23, 59, 59, 999);
      if (date > end) return false;
    }
    return true;
  }

  if (timeframe === "today") {
    return (
      date.toDateString() === now.toDateString()
    );
  }

  if (timeframe === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return date >= weekAgo && date <= now;
  }

  if (timeframe === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  if (timeframe === "year") {
    return date.getFullYear() === now.getFullYear();
  }

  return true;
}

export type ComparisonUnit =
  | "day"
  | "week"
  | "month"
  | "year";

export interface PeriodComparison {
  currentCount: number;

  currentVolume: number;

  previousCount: number;

  previousVolume: number;

  percentChange: number | null;

  absoluteChange: number;
}

function isInCurrentPeriod(
  date: Date,
  now: Date,
  unit: ComparisonUnit
): boolean {
  if (unit === "day") {
    return date.toDateString() === now.toDateString();
  }

  if (unit === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo && date <= now;
  }

  if (unit === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  return date.getFullYear() === now.getFullYear();
}

function isInPreviousPeriod(
  date: Date,
  now: Date,
  unit: ComparisonUnit
): boolean {
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
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    return (
      date.getFullYear() === lastMonth.getFullYear() &&
      date.getMonth() === lastMonth.getMonth()
    );
  }

  return date.getFullYear() === now.getFullYear() - 1;
}

export function comparePeriod(
  transactions: Transaction[],
  unit: ComparisonUnit
): PeriodComparison {
  const now = new Date();

  let currentCount = 0;
  let currentVolume = 0;
  let previousCount = 0;
  let previousVolume = 0;

  for (const transaction of transactions) {
    const date = new Date(transaction.createdAt);

    if (isInCurrentPeriod(date, now, unit)) {
      currentCount += 1;
      currentVolume += transaction.amount;
    } else if (isInPreviousPeriod(date, now, unit)) {
      previousCount += 1;
      previousVolume += transaction.amount;
    }
  }

  const absoluteChange = currentVolume - previousVolume;

  const percentChange =
    previousVolume === 0
      ? null
      : (absoluteChange / previousVolume) * 100;

  return {
    currentCount,
    currentVolume,
    previousCount,
    previousVolume,
    percentChange,
    absoluteChange,
  };
}

export function toTransactionExportTable(
  transactions: Transaction[],
  title = "Transactions"
): ExportTable {
  return {
    title,
    headers: [
      "Reference",
      "Organization",
      "Entity Type",
      "Amount",
      "Currency",
      "Provider",
      "Payment Method",
      "Status",
      "Disputed",
      "Date",
    ],
    rows: transactions.map((transaction) => [
      transaction.reference,
      transaction.organization,
      ORGANIZATION_TYPE_LABELS[transaction.entityType],
      transaction.amount,
      transaction.currency,
      transaction.provider,
      transaction.paymentMethod,
      transaction.status,
      transaction.disputed ? "Yes" : "No",
      new Date(transaction.createdAt).toLocaleString(),
    ]),
  };
}
