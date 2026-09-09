'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarFilterControls } from './CalendarFilterControls';

interface CalendarHeaderControlsProps {
  calendarMonth: Date;
  calendarDepartment: string;
  includePending: boolean;
  departments: { id: string; name: string }[];
  months: string[];
  years: number[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToToday: () => void;
  onSelectMonth: (monthIdx: number) => void;
  onSelectYear: (year: number) => void;
  onSelectDepartment: (dept: string) => void;
  onTogglePending: () => void;
  onFoldUp: () => void;
}

export function CalendarHeaderControls({
  calendarMonth,
  calendarDepartment,
  includePending,
  departments,
  months,
  years,
  onPrevMonth,
  onNextMonth,
  onJumpToToday,
  onSelectMonth,
  onSelectYear,
  onSelectDepartment,
  onTogglePending,
  onFoldUp,
}: CalendarHeaderControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      {/* Navigation Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-0.5 bg-muted/40 p-0.5 rounded-lg border border-border/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevMonth}
            className="h-6.5 w-6.5 rounded cursor-pointer hover:bg-card"
            title="Previous month"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onJumpToToday}
            className="h-6.5 px-2 text-[11px] font-semibold rounded cursor-pointer hover:bg-card"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="h-6.5 w-6.5 rounded cursor-pointer hover:bg-card"
            title="Next month"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>

        {/* Month Selector */}
        <Select
          value={String(calendarMonth.getMonth())}
          onValueChange={(val) => { if (val !== null) onSelectMonth(parseInt(val)); }}
        >
          <SelectTrigger className="h-7 w-[105px] text-[11px] font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, idx) => (
              <SelectItem key={idx} value={String(idx)} className="text-xs">
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Selector */}
        <Select
          value={String(calendarMonth.getFullYear())}
          onValueChange={(val) => { if (val !== null) onSelectYear(parseInt(val)); }}
        >
          <SelectTrigger className="h-7 w-[78px] text-[11px] font-medium">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)} className="text-xs">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filters, Toggle, and Go Back Up Action */}
      <CalendarFilterControls
        calendarDepartment={calendarDepartment}
        includePending={includePending}
        departments={departments}
        onSelectDepartment={onSelectDepartment}
        onTogglePending={onTogglePending}
        onFoldUp={onFoldUp}
      />
    </div>
  );
}
