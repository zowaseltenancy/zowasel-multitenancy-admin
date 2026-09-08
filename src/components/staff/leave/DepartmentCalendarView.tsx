'use client';

import React from 'react';
import { ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LeaveRequest } from '@/types/staff';
import { CalendarHeaderControls } from './calendar/CalendarHeaderControls';
import { CalendarMatrixGrid } from './calendar/CalendarMatrixGrid';

interface DepartmentCalendarViewProps {
  open: boolean;
  calendarMonth: Date;
  calendarDepartment: string;
  includePending: boolean;
  departments: { id: string; name: string }[];
  months: string[];
  years: number[];
  calendarDays: (number | null)[];
  getLeavesForDate: (day: number) => LeaveRequest[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToToday: () => void;
  onSelectMonth: (monthIdx: number) => void;
  onSelectYear: (year: number) => void;
  onSelectDepartment: (dept: string) => void;
  onTogglePending: () => void;
  onClose: () => void;
  onSelectAbsence: (leave: LeaveRequest) => void;
}

const LEAVE_TYPE_LEGEND = [
  { label: 'Annual', color: 'bg-emerald-500', textClass: 'text-emerald-700 dark:text-emerald-300', bgClass: 'bg-emerald-500/10 border-emerald-500/30' },
  { label: 'Sick', color: 'bg-rose-500', textClass: 'text-rose-700 dark:text-rose-300', bgClass: 'bg-rose-500/10 border-rose-500/30' },
  { label: 'Casual', color: 'bg-blue-500', textClass: 'text-blue-700 dark:text-blue-300', bgClass: 'bg-blue-500/10 border-blue-500/30' },
  { label: 'Parental', color: 'bg-purple-500', textClass: 'text-purple-700 dark:text-purple-300', bgClass: 'bg-purple-500/10 border-purple-500/30' },
  { label: 'Unpaid', color: 'bg-amber-500', textClass: 'text-amber-700 dark:text-amber-300', bgClass: 'bg-amber-500/10 border-amber-500/30' },
];

export function DepartmentCalendarView({
  open,
  calendarMonth,
  calendarDepartment,
  includePending,
  departments,
  months,
  years,
  calendarDays,
  getLeavesForDate,
  onPrevMonth,
  onNextMonth,
  onJumpToToday,
  onSelectMonth,
  onSelectYear,
  onSelectDepartment,
  onTogglePending,
  onClose,
  onSelectAbsence,
}: DepartmentCalendarViewProps) {
  if (!open) return null;

  return (
    <Card className="max-w-5xl mx-auto border border-border/70 rounded-2xl shadow-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Top Colorful Gradient Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-amber-500" />

      <CardHeader className="p-3 sm:p-4 border-b border-border/50 bg-card">
        <CalendarHeaderControls
          calendarMonth={calendarMonth}
          calendarDepartment={calendarDepartment}
          includePending={includePending}
          departments={departments}
          months={months}
          years={years}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
          onJumpToToday={onJumpToToday}
          onSelectMonth={onSelectMonth}
          onSelectYear={onSelectYear}
          onSelectDepartment={onSelectDepartment}
          onTogglePending={onTogglePending}
          onFoldUp={onClose}
        />

        {/* Vibrant Multi-Color Legend Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/40 mt-2">
          {/* Leave Type Color Indicators */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="text-muted-foreground font-semibold uppercase tracking-wider text-[9px] mr-1 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-primary" />
              Types:
            </span>

            {LEAVE_TYPE_LEGEND.map((t) => (
              <span
                key={t.label}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border font-medium ${t.bgClass} ${t.textClass}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${t.color}`} />
                {t.label}
              </span>
            ))}

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-dashed border-amber-500/60 bg-amber-500/5 text-amber-700 dark:text-amber-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pending
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground">
            <span className="text-muted-foreground/70 font-medium hidden sm:inline">
              Working Days Mon–Fri
            </span>
            <span className="font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md border text-[10px]">
              {calendarMonth.toLocaleString('default', { month: 'short' })} {calendarMonth.getFullYear()}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <CalendarMatrixGrid
          calendarDays={calendarDays}
          calendarMonth={calendarMonth}
          getLeavesForDate={getLeavesForDate}
          onSelectAbsence={onSelectAbsence}
        />
      </CardContent>

      {/* Bottom collapse bar */}
      <div className="py-1.5 border-t border-border/40 bg-muted/20 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 text-[11px] text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer font-medium"
        >
          <ChevronUp className="h-3 w-3" />
          <span>Fold calendar view</span>
        </Button>
      </div>
    </Card>
  );
}
