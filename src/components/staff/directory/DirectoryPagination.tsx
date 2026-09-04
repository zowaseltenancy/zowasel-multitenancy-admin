'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DirectoryPaginationProps {
  filteredLength: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function DirectoryPagination({
  filteredLength,
  page,
  totalPages,
  pageSize,
  onPageChange,
}: DirectoryPaginationProps) {
  const startItem = filteredLength > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, filteredLength);

  return (
    <div className="p-3.5 sm:p-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-emerald-500/5 dark:bg-emerald-500/10">
      <p className="font-medium">
        Showing{' '}
        <strong className="text-[#008C44] dark:text-[#00C862] font-mono font-bold">
          {startItem}–{endItem}
        </strong>{' '}
        of <strong className="text-foreground font-mono font-bold">{filteredLength}</strong> personnel records
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer border-emerald-500/30 hover:bg-emerald-500/15 hover:text-[#008C44] dark:hover:text-[#00C862] disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Previous
        </Button>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                const isCurrent = p === page;

                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-1 text-xs text-muted-foreground">...</span>}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`h-8 w-8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#00A651] text-white shadow-xs hover:bg-[#008C44]'
                          : 'border border-emerald-500/20 bg-background hover:bg-emerald-500/10 text-foreground hover:text-[#008C44] dark:hover:text-[#00C862]'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>
        )}

        {totalPages <= 1 && (
          <span className="px-2 font-mono font-bold text-foreground">
            {page} / {Math.max(1, totalPages)}
          </span>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || filteredLength === 0}
          className="h-8 px-2.5 text-xs gap-1 cursor-pointer border-emerald-500/30 hover:bg-emerald-500/15 hover:text-[#008C44] dark:hover:text-[#00C862] disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
