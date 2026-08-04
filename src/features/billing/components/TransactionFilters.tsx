"use client";

import { cn } from "@/lib/utils";
import { ORGANIZATION_TYPE_FILTERS } from "@/constants/organization";
import { OrganizationType } from "@/types/organization";
import {
  CustomRange,
  TransactionTimeframe,
} from "../utils/transaction";
import { TransactionStatusFilter } from "./TransactionsListView";

export type TransactionSort =
  | "newest"
  | "oldest"
  | "amount_high"
  | "amount_low";

const TIMEFRAME_OPTIONS: {
  label: string;
  value: TransactionTimeframe;
}[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Custom Range", value: "custom" },
];

const ALL_STATUS_OPTIONS: {
  label: string;
  value: TransactionStatusFilter;
}[] = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Failed", value: "Failed" },
  { label: "Refunded", value: "Refunded" },
  { label: "Disputed", value: "disputed" },
];

interface Props {
  timeframe: TransactionTimeframe;
  onTimeframeChange: (value: TransactionTimeframe) => void;
  customRange: CustomRange;
  onCustomRangeChange: (value: CustomRange) => void;
  statusFilter: TransactionStatusFilter;
  onStatusFilterChange: (value: TransactionStatusFilter) => void;
  statusEditable?: boolean;
  entityType: OrganizationType | "all";
  onEntityTypeChange: (value: OrganizationType | "all") => void;
  sort: TransactionSort;
  onSortChange: (value: TransactionSort) => void;
}

export default function TransactionFilters({
  timeframe,
  onTimeframeChange,
  customRange,
  onCustomRangeChange,
  statusFilter,
  onStatusFilterChange,
  statusEditable = true,
  entityType,
  onEntityTypeChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full border-b border-border/80 pb-3">
      {/* Timeframe Buttons + Direct Date Inputs on Same Line */}
      <div className="flex flex-wrap items-center gap-2">
        {TIMEFRAME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onTimeframeChange(option.value)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
              timeframe === option.value
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}

        {/* Direct Calendar Inputs when Custom Range is active */}
        {timeframe === "custom" && (
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] font-semibold text-muted-foreground pl-1">From:</span>
              <input
                type="date"
                value={customRange.start}
                onChange={(event) =>
                  onCustomRangeChange({
                    ...customRange,
                    start: event.target.value,
                  })
                }
                className="h-7 rounded-lg border border-input bg-card px-2 text-xs font-mono outline-none focus-visible:border-primary cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] font-semibold text-muted-foreground">To:</span>
              <input
                type="date"
                value={customRange.end}
                onChange={(event) =>
                  onCustomRangeChange({
                    ...customRange,
                    end: event.target.value,
                  })
                }
                className="h-7 rounded-lg border border-input bg-card px-2 text-xs font-mono outline-none focus-visible:border-primary cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Unified Filter Row: Status Pills (matching Invoices/Settlements/Subscriptions), All Entities, Newest First */}
      <div className="flex flex-wrap items-center gap-2">
        {statusEditable && (
          <div className="flex flex-wrap items-center gap-1.5">
            {ALL_STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onStatusFilterChange(option.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  statusFilter === option.value
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <select
          value={entityType}
          onChange={(event) =>
            onEntityTypeChange(event.target.value as OrganizationType | "all")
          }
          className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
        >
          {ORGANIZATION_TYPE_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as TransactionSort)
          }
          className="h-9 rounded-xl border border-input bg-card px-3 text-xs font-semibold outline-none focus-visible:border-primary cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Amount: High to Low</option>
          <option value="amount_low">Amount: Low to High</option>
        </select>
      </div>
    </div>
  );
}
