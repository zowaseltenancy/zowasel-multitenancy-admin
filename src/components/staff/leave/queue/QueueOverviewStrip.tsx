'use client';

import React from 'react';
import { Clock, ShieldAlert, Building2 } from 'lucide-react';

interface QueueOverviewStripProps {
  totalPending: number;
  filteredCount: number;
  conflictCount: number;
  departmentsAffectedCount: number;
}

export function QueueOverviewStrip({
  totalPending,
  filteredCount,
  conflictCount,
  departmentsAffectedCount,
}: QueueOverviewStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      <div className="border border-amber-500/25 dark:border-amber-500/30 rounded-2xl bg-amber-500/10 dark:bg-amber-950/25 p-4 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
            Pending Authorization
          </span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {totalPending}
          </p>
          <span className="text-[10.5px] text-muted-foreground block">
            {filteredCount} matching current filter
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      <div className="border border-rose-500/25 dark:border-rose-500/30 rounded-2xl bg-rose-500/10 dark:bg-rose-950/25 p-4 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider block">
            Department Overlaps
          </span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {conflictCount}
          </p>
          <span className="text-[10.5px] text-rose-600 dark:text-rose-400 font-medium block">
            {conflictCount > 0 ? 'Concurrent absence alert active' : 'No schedule clashes'}
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      <div className="border border-blue-500/25 dark:border-blue-500/30 rounded-2xl bg-blue-500/10 dark:bg-blue-950/25 p-4 shadow-2xs flex items-center justify-between transition-all hover:shadow-xs">
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider block">
            Departments Affected
          </span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {departmentsAffectedCount}
          </p>
          <span className="text-[10.5px] text-muted-foreground block">
            Requiring supervisor sign-off
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
