'use client';

import { History, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LifecycleLeaveCardProps {
  status?: string;
  statusHistory?: Array<{ status: string; at: string }>;
  onNavigateStatus: () => void;
  onNavigateLeave?: () => void;
  onRequestLeave?: () => void;
}

export function LifecycleLeaveCard({
  status = 'active',
  statusHistory,
  onNavigateStatus,
}: LifecycleLeaveCardProps) {
  const isSuspended =
    status?.toLowerCase() === 'suspended' || status?.toLowerCase() === 'inactive';

  const latestTransition =
    statusHistory && statusHistory.length > 0
      ? statusHistory[statusHistory.length - 1].status.toUpperCase()
      : 'ACTIVATED';

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Account Lifecycle
          </h3>
        </div>

        <button
          type="button"
          onClick={onNavigateStatus}
          className="text-xs font-semibold text-[#008C44] dark:text-[#00C862] hover:underline flex items-center gap-1 cursor-pointer"
        >
          Log <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Current Status</span>
          <Badge
            variant="outline"
            className={`text-[10.5px] font-semibold uppercase ${
              !isSuspended
                ? 'border-[#00A651]/30 bg-[#00A651]/10 text-[#008C44] dark:text-[#00C862]'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {status}
          </Badge>
        </div>

        <div className="p-2.5 rounded-xl border border-border/70 bg-muted/20 space-y-1">
          <span className="text-[10.5px] text-muted-foreground block">
            Latest Transition:
          </span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-[11.5px]">
            {latestTransition}
          </p>
          <p className="text-[10.5px] text-muted-foreground">
            Managed via PATCH /admin/staff/:id/status
          </p>
        </div>
      </div>
    </div>
  );
}
