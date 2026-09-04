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
      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Pending Authorization
          </span>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {totalPending}
          </p>
          <span className="text-[10.5px] text-muted-foreground block">
            {filteredCount} matching current filter
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Department Overlaps
          </span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {conflictCount}
          </p>
          <span className="text-[10.5px] text-rose-600 dark:text-rose-400 font-medium block">
            {conflictCount > 0 ? 'Concurrent absence alert active' : 'No schedule clashes'}
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      <div className="border border-border/60 rounded-2xl bg-card p-4 shadow-2xs flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Departments Affected
          </span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {departmentsAffectedCount}
          </p>
          <span className="text-[10.5px] text-muted-foreground block">
            Requiring supervisor sign-off
          </span>
        </div>
        <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
