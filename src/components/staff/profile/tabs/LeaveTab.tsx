'use client';

import { CalendarDays, CalendarPlus } from 'lucide-react';
import { StaffMember, LeaveRequest } from '@/types/staff';
import { Button } from '@/components/ui/button';
import { LeaveBalanceSummary } from './leave/LeaveBalanceSummary';
import { LeaveHistoryList } from './leave/LeaveHistoryList';

interface LeaveTabProps {
  staff: StaffMember;
  leaveRequests?: LeaveRequest[];
  onRequestLeave: () => void;
}

export function LeaveTab({
  staff,
  leaveRequests = [],
  onRequestLeave,
}: LeaveTabProps) {
  const staffRequests = leaveRequests.filter(
    (req) => req.staffId === staff.id || req.staffName?.toLowerCase().includes(staff.lastName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Action */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Leave & Absence Balances
              </h3>
              <p className="text-xs text-muted-foreground">
                Zowasel SSO Backend Track (Section 4.3) leave quotas computed server-side against working calendars.
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={onRequestLeave}
            className="h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
          >
            <CalendarPlus className="h-3.5 w-3.5" /> Submit Leave Request
          </Button>
        </div>

        {/* Leave Balance Quota Cards */}
        <LeaveBalanceSummary />
      </div>

      {/* 2. Leave Requests & History Table */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Leave Application History
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              History of submitted leave requests, approval decisions, and review statuses.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            GET /api/v1/admin/leave/requests
          </span>
        </div>

        <LeaveHistoryList requests={staffRequests} />
      </div>
    </div>
  );
}
