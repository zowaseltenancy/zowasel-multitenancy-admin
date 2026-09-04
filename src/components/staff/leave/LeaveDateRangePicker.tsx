'use client';

import React from 'react';
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
    <>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="font-semibold text-xs">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="font-semibold text-xs">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {workingDays > 0 && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center justify-between">
          <span>Calculated business days:</span>
          <span className="font-bold font-mono">{workingDays} working days</span>
        </div>
      )}
    </>
  );
}