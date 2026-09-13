import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { LeaveRequest } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

interface LeaveHistoryListProps {
  requests: LeaveRequest[];
}

export function LeaveHistoryList({ requests }: LeaveHistoryListProps) {
  if (requests.length === 0) {
    return (
      <div className="py-8 text-center space-y-2">
        <CalendarDays className="h-8 w-8 text-muted-foreground/50 mx-auto" />
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          No leave requests recorded yet
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Submitted leave requests and reviewer actions for this staff account will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/40">
      {requests.map((req) => (
        <div
          key={req.id}
          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono text-[11px]">
                {req.type} LEAVE
              </span>
              <Badge
                variant="outline"
                className={`text-[10.5px] font-medium px-2 py-0.2 ${
                  req.status === 'approved'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : req.status === 'rejected'
                    ? 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                {req.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {req.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                {req.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                <span className="capitalize">{req.status}</span>
              </Badge>
            </div>

            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{req.startDate}</span> to{' '}
              <span className="font-medium text-foreground">{req.endDate}</span> ({req.days} working days)
            </p>
            {req.reason && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                &ldquo;{req.reason}&rdquo;
              </p>
            )}
          </div>

          {/* appliedOn / reviewedBy were never fields on LeaveRequest — the
              record stores createdAt and approvedBy. */}
          <div className="text-right text-[11px] text-muted-foreground shrink-0">
            <p>
              Applied{' '}
              {req.createdAt
                ? new Date(req.createdAt).toLocaleDateString()
                : 'recently'}
            </p>
            {req.approvedBy && (
              <p className="text-[10.5px] text-slate-500">Reviewed by {req.approvedBy}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}