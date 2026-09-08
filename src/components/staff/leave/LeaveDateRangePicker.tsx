'use client';

import React from 'react';
import { CalendarDays, CheckCircle2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeaveDateRangePickerProps {
  startDate: string;
  endDate: string;
  workingDays: number;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
}

export function LeaveDateRangePicker({
  startDate,
  endDate,
  workingDays,
  onStartDateChange,
  onEndDateChange,
}: LeaveDateRangePickerProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-10 text-xs font-medium border-border/80 focus-visible:border-primary"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="font-semibold text-xs flex items-center gap-1.5 text-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-10 text-xs font-medium border-border/80 focus-visible:border-primary"
          />
        </div>
      </div>

      {workingDays > 0 ? (
        <div className="rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-900 dark:text-emerald-200 font-medium flex items-center justify-between shadow-2xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Deductible Working Days:
          </span>
          <span className="font-black font-mono text-sm px-2.5 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
            {workingDays} {workingDays === 1 ? 'day' : 'days'}
          </span>
        </div>
      ) : (
        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 px-1">
          <Info className="h-3 w-3 text-muted-foreground/70" />
          <span>Weekends (Saturday & Sunday) are non-deductible rest days.</span>
        </div>
      )}
    </div>
  );
}