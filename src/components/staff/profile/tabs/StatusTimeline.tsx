'use client';

import { History, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HistoryItem {
  status: string;
  at: string;
  reason?: string;
}

interface StatusTimelineProps {
  historyItems: HistoryItem[];
  formatDate: (dateStr?: string) => string;
}

export function StatusTimeline({ historyItems, formatDate }: StatusTimelineProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#00A651]" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Status Transition Log
          </h4>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          statusHistory[]
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
        {historyItems.map((item, index) => {
          const isLatest = index === historyItems.length - 1;
          const statusLower = item.status?.toLowerCase();

          return (
            <div key={index} className="relative">
              <span
                className={`absolute -left-6 top-1.5 h-4 w-4 rounded-full border-2 border-card flex items-center justify-center ${
                  statusLower === 'active'
                    ? 'bg-[#00A651]'
                    : statusLower === 'invited'
                    ? 'bg-blue-500'
                    : 'bg-amber-500'
                }`}
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono">
                    {item.status}
                  </span>
                  {isLatest && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold border-[#00A651]/30 text-[#008C44] dark:text-[#00C862]">
                      Current
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {formatDate(item.at)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  {item.reason || `Status transitioned to ${item.status}.`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
