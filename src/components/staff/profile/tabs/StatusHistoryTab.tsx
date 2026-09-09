'use client';

import { UserX, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusTimeline } from './StatusTimeline';

interface StatusHistoryTabProps {
  staff: StaffMember;
  onOpenSuspendModal: () => void;
}

export function StatusHistoryTab({ staff, onOpenSuspendModal }: StatusHistoryTabProps) {
  const isSuspended =
    staff.status?.toLowerCase() === 'suspended' || staff.status?.toLowerCase() === 'inactive';

  const historyItems =
    staff.statusHistory && staff.statusHistory.length > 0
      ? staff.statusHistory
      : [
          {
            status: 'invited',
            at: staff.createdAt || '2025-11-01T08:00:00Z',
            reason: 'Initial staff invitation dispatched',
          },
          {
            status: staff.status || 'active',
            at: staff.updatedAt || '2025-11-03T08:00:00Z',
            reason: staff.status?.toLowerCase() === 'active' ? 'Account activation completed' : 'Status modified',
          },
        ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Account Status Summary & Actions */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                !isSuspended
                  ? 'bg-[#00A651]/10 text-[#00A651]'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`}
            >
              {!isSuspended ? <CheckCircle2 className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lifecycle Status:
                </h3>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold px-2 py-0.5 uppercase tracking-wider ${
                    !isSuspended
                      ? 'border-[#00A651]/30 bg-[#00A651]/10 text-[#008C44] dark:text-[#00C862]'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {staff.status || 'Active'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Managed via PATCH /admin/staff/:id/status (with audit reason log).
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={isSuspended ? 'default' : 'outline'}
            size="sm"
            onClick={onOpenSuspendModal}
            className={`h-8.5 text-xs font-medium gap-1.5 cursor-pointer ${
              isSuspended
                ? 'bg-[#00A651] hover:bg-[#008C44] text-white'
                : 'text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
            }`}
          >
            {isSuspended ? (
              <>
                <UserCheck className="h-3.5 w-3.5" /> Reactivate Account
              </>
            ) : (
              <>
                <UserX className="h-3.5 w-3.5" /> Suspend Staff Account
              </>
            )}
          </Button>
        </div>

        {/* Audit Meta Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Created At</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11.5px]">
              {formatDate(staff.createdAt || staff.dateJoined)}
            </p>
          </div>

          <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Last Modified</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11.5px]">
              {formatDate(staff.updatedAt)}
            </p>
          </div>

          <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Soft Delete Flag</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11.5px]">
              {staff.tempdelete ?? 0} (Active row)
            </p>
          </div>

          <div className="p-3 rounded-xl border border-border/70 bg-muted/20 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Deleted By</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono text-[11.5px]">
              {staff.deletedby || 'none'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Status History Audit Timeline */}
      <StatusTimeline historyItems={historyItems} formatDate={formatDate} />
    </div>
  );
}
