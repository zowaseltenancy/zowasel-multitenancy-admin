'use client';

import { Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaffPerformance } from '@/types/staff';

interface PerformanceScoreBannerProps {
  perf: StaffPerformance;
}

export function PerformanceScoreBanner({ perf }: PerformanceScoreBannerProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-[#00A651] shrink-0 shadow-xs">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {perf.overallScore}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">/ 5.0 Rating</span>
              <Badge
                variant="outline"
                className="ml-2 text-xs font-bold text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10"
              >
                {perf.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Calculated across quarterly reviews, KPI achievement rates, and field supervisor ratings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-4 w-4 ${
                s <= Math.floor(perf.overallScore)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}