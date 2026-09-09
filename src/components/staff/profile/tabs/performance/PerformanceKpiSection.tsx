'use client';

import { TrendingUp } from 'lucide-react';
import { StaffPerformance } from '@/types/staff';

interface PerformanceKpiSectionProps {
  kpis: StaffPerformance['kpis'];
}

export function PerformanceKpiSection({ kpis }: PerformanceKpiSectionProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <TrendingUp className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Core Key Performance Indicators (KPIs)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2 text-xs"
          >
            <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
              {kpi.name}
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-muted-foreground block">Actual / Current</span>
                <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                  {kpi.current}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Target</span>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 font-mono">
                  {kpi.target}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10.5px]">
              <span className="text-muted-foreground">Achievement Rate:</span>
              <span className="font-bold text-[#008C44] dark:text-[#00C862] font-mono">
                {kpi.achievementRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}