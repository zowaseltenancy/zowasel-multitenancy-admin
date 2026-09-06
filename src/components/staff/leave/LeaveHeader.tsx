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
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Leave Requests
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Request time off, view personal leave history, and track team absence schedules.
        </p>
      </div>

      {/* Action Buttons Toolbar - Guaranteed single line */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap shrink-0 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none]">
        {/* Approval Queue Link */}
        <Link
          href="/admin/staff/leave/request"
          className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-muted/40 transition-colors cursor-pointer whitespace-nowrap shrink-0 h-9"
        >
          <CheckCircle2 className="h-4 w-4 text-[#44883C]" />
          <span>Approval Queue</span>
          {pendingApprovalCount > 0 && (
            <Badge variant="outline" className="ml-0.5 text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-mono">
              {pendingApprovalCount}
            </Badge>
          )}
        </Link>

        {/* Calendar Dropdown Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onToggleCalendar}
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold gap-2 cursor-pointer shadow-2xs transition-all whitespace-nowrap shrink-0 h-9 ${
            isCalendarOpen
              ? 'bg-[#44883C]/15 text-[#44883C] dark:text-[#5cb850] border-[#44883C]/40'
              : 'bg-card text-foreground border-border/70 hover:bg-muted/40'
          }`}
          title={isCalendarOpen ? 'Click to fold calendar back up' : 'Click to drop down calendar'}
        >
          <CalendarDays className="h-4 w-4 text-[#44883C]" />
          <span>Calendar</span>
          {isCalendarOpen ? (
            <ChevronUp className="h-4 w-4 text-[#44883C] transition-transform duration-200" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
          )}
        </Button>

        {/* Request Time Off CTA */}
        <Button
          onClick={onRequestTimeOff}
          className="bg-[#44883C] hover:bg-[#3b7434] text-white font-bold text-xs gap-1.5 h-9 px-3.5 rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Request Time Off</span>
        </Button>
      </div>
    </div>
  );
}
