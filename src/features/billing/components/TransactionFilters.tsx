"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ORGANIZATION_TYPE_FILTERS } from "@/constants/organization";
import { OrganizationType } from "@/types/organization";
import {
  CustomRange,
  TransactionTimeframe,
} from "../utils/transaction";

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
  { label: "Custom Calendar Range", value: "custom" },
];

interface Props {
  timeframe: TransactionTimeframe;

  onTimeframeChange: (
    value: TransactionTimeframe
  ) => void;

  customRange: CustomRange;

  onCustomRangeChange: (value: CustomRange) => void;

  entityType: OrganizationType | "all";

  onEntityTypeChange: (
    value: OrganizationType | "all"
  ) => void;

  search: string;

  onSearchChange: (value: string) => void;

  sort: TransactionSort;

  onSortChange: (value: TransactionSort) => void;
}

export default function TransactionFilters({
  timeframe,
  onTimeframeChange,
  customRange,
  onCustomRangeChange,
  entityType,
  onEntityTypeChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TIMEFRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onTimeframeChange(option.value)
              }
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                timeframe === option.value
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search by business or reference..."
          className="max-w-xs h-9 text-xs"
        />
      </div>

      {/* Calendar-Based Custom Date Range Filter */}
      {timeframe === "custom" && (
        <div className="p-3.5 rounded-xl border border-border bg-card flex flex-wrap items-center gap-4 shadow-2xs">
          <div className="text-xs font-semibold text-foreground">Custom Date Range:</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">From:</span>
            <input
              type="date"
              value={customRange.start}
              onChange={(event) =>
                onCustomRangeChange({
                  ...customRange,
                  start: event.target.value,
                })
              }
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-mono outline-none focus-visible:border-primary cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">To:</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(event) =>
                onCustomRangeChange({
                  ...customRange,
                  end: event.target.value,
                })
              }
              className="h-9 rounded-lg border border-input bg-background px-3 text-xs font-mono outline-none focus-visible:border-primary cursor-pointer"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-3">
          <select
            value={entityType}
            onChange={(event) =>
              onEntityTypeChange(
                event.target.value as OrganizationType | "all"
              )
            }
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-primary"
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
            className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount_high">Amount: High to Low</option>
            <option value="amount_low">Amount: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
