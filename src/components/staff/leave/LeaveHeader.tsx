'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LeaveHeaderProps {
  pendingApprovalCount: number;
  isCalendarOpen: boolean;
  onToggleCalendar: () => void;
  onRequestTimeOff: () => void;
}

export function LeaveHeader({
  pendingApprovalCount,
  isCalendarOpen,
  onToggleCalendar,
  onRequestTimeOff,
}: LeaveHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Leave Requests
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Request time off, view personal leave history, and track team absence schedules.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Approval Queue Link */}
        <Link
          href="/admin/staff/leave/request"
          className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white shadow-2xs hover:bg-muted/40 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="h-4 w-4 text-[#00A651]" />
          <span>Approval Queue</span>
          {pendingApprovalCount > 0 && (
            <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 border-amber-500/30 font-mono">
              {pendingApprovalCount}
            </Badge>
          )}
        </Link>

        {/* Department Calendar Dropdown Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onToggleCalendar}
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold gap-2 cursor-pointer shadow-2xs transition-all ${
            isCalendarOpen
              ? 'bg-[#00A651]/15 text-[#00A651] border-[#00A651]/50'
              : 'bg-card text-foreground border-border/70 hover:bg-muted/40'
          }`}
          title={isCalendarOpen ? 'Click to fold calendar back up' : 'Click to drop down calendar'}
        >
          <CalendarDays className="h-4 w-4 text-[#00A651]" />
          <span>Department Calendar</span>
          {isCalendarOpen ? (
            <ChevronUp className="h-4 w-4 text-[#00A651] transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          )}
        </Button>

        {/* Request Time Off CTA */}
        <Button
          onClick={onRequestTimeOff}
          className="bg-[#00A651] hover:bg-[#008C44] text-white font-bold text-xs gap-1.5 h-9 rounded-xl shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Request Time Off</span>
        </Button>
      </div>
    </div>
  );
}
