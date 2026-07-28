"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  totalItems?: number;
  pageSizeOptions?: number[];
}

export default function Pagination({
  page,
  pageCount,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [5, 10, 15, 20],
}: Props) {
  if (pageCount <= 0 && (!totalItems || totalItems === 0)) {
    return null;
  }

  const startItem = totalItems ? Math.min((page - 1) * pageSize + 1, totalItems) : (page - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(page * pageSize, totalItems) : page * pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 border-t border-border/60">
      {/* Left: Items counter & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        {totalItems !== undefined ? (
          <p className="font-medium">
            Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span> entries
          </p>
        ) : (
          <p className="font-medium">
            Page <span className="font-semibold text-foreground">{page}</span> of{" "}
            <span className="font-semibold text-foreground">{pageCount}</span>
          </p>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
            <span className="text-muted-foreground font-medium">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="h-7 rounded-md border border-input bg-background px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Previous</span>
        </Button>

        {pageCount > 1 && (
          <div className="hidden md:flex items-center gap-1">
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                  <div key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`h-8 w-8 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        p === page
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                );
              })}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= pageCount || pageCount <= 1}
          onClick={() => onPageChange(page + 1)}
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
