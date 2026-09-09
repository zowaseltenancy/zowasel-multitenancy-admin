'use client';

import { Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaffPerformance } from '@/types/staff';

interface PerformanceGoalsSectionProps {
  goals: StaffPerformance['goals'];
}

export function PerformanceGoalsSection({ goals }: PerformanceGoalsSectionProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <Target className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Current Goals & Strategic Objectives
        </h3>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {goal.title}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] capitalize font-semibold ${
                  goal.status === 'achieved'
                    ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                    : 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10'
                }`}
              >
                {goal.status}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">{goal.target}</p>

            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Progress</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{goal.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#00A651] h-full rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}