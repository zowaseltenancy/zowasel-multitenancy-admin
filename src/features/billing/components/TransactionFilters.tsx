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
  { label: "Custom Range", value: "custom" },
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TIMEFRAME_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onTimeframeChange(option.value)
            }
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              timeframe === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {timeframe === "custom" && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            From
            <input
              type="date"
              value={customRange.start}
              onChange={(event) =>
                onCustomRangeChange({
                  ...customRange,
                  start: event.target.value,
                })
              }
              className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            To
            <input
              type="date"
              value={customRange.end}
              onChange={(event) =>
                onCustomRangeChange({
                  ...customRange,
                  end: event.target.value,
                })
              }
              className="h-9 rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
            />
          </label>
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={entityType}
            onChange={(event) =>
              onEntityTypeChange(
                event.target.value as
                  | OrganizationType
                  | "all"
              )
            }
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          >
            {ORGANIZATION_TYPE_FILTERS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <select
            value={sort}
            onChange={(event) =>
              onSortChange(
                event.target.value as TransactionSort
              )
            }
            className="h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-primary"
          >
            <option value="newest">
              Newest First
            </option>
            <option value="oldest">
              Oldest First
            </option>
            <option value="amount_high">
              Amount: High to Low
            </option>
            <option value="amount_low">
              Amount: Low to High
            </option>
          </select>
        </div>

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search by business or reference..."
          className="max-w-xs"
        />
      </div>
    </div>
  );
}
