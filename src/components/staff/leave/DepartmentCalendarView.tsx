'use client';

import React from 'react';
import { ChevronUp } from 'lucide-react';
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
    <Card className="max-w-4xl mx-auto border border-border/60 rounded-xl shadow-xs overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      <CardHeader className="p-2.5 sm:p-3 border-b border-border/50 bg-card/90">
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

        {/* Subheader legend */}
        <div className="flex items-center justify-between pt-1.5 text-[10.5px] text-muted-foreground border-t border-border/40 mt-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <strong className="text-foreground">Approved</strong>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 ml-1.5" />
            <strong className="text-foreground">Pending</strong>
            <span className="text-[10px] text-muted-foreground ml-1.5 font-medium">• Working days only</span>
          </span>
          <span className="font-mono text-[10px]">
            {calendarMonth.toLocaleString('default', { month: 'short' })} {calendarMonth.getFullYear()}
          </span>
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
      <div className="py-1 border-t border-border/40 bg-muted/15 flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-5 text-[10.5px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
        >
          <ChevronUp className="h-2.5 w-2.5" />
          <span>Fold calendar back up</span>
        </Button>
      </div>
    </Card>
  );
}
