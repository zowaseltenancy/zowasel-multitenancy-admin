'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { LeaveRequest } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { LeaveTypeTheme, getLeaveTypeTheme } from '../leaveUtils';

interface CalendarMatrixGridProps {
  calendarDays: (number | null)[];
  calendarMonth: Date;
  getLeavesForDate: (day: number) => LeaveRequest[];
  onSelectAbsence: (leave: LeaveRequest) => void;
}

const WEEKDAYS = [
  { label: 'Sun', isWeekend: true }, { label: 'Mon', isWeekend: false },
  { label: 'Tue', isWeekend: false }, { label: 'Wed', isWeekend: false },
  { label: 'Thu', isWeekend: false }, { label: 'Fri', isWeekend: false },
  { label: 'Sat', isWeekend: true },
];

export function CalendarMatrixGrid({
  calendarDays,
  calendarMonth,
  getLeavesForDate,
  onSelectAbsence,
}: CalendarMatrixGridProps) {
  return (
    <div className="p-0 overflow-hidden">
      {/* Calendar Grid Header with Colorful Weekday Accents */}
      <div className="grid grid-cols-7 border-b border-border/70 text-center text-[11px] font-bold">
        {WEEKDAYS.map((dayItem) => (
          <div
            key={dayItem.label}
            className={`py-2 transition-colors ${
              dayItem.isWeekend
                ? 'bg-rose-500/10 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold'
                : 'bg-muted/40 text-foreground font-semibold'
            }`}
          >{dayItem.label}</div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-px bg-border/60">
        {calendarDays.map((day, idx) => {
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const leaves = day && !isWeekend ? getLeavesForDate(day) : [];
          const dominantTheme = leaves.length > 0 ? getLeaveTypeTheme(leaves[0].type) : null;

          const now = new Date();
          const isToday =
            day === now.getDate() &&
            calendarMonth.getMonth() === now.getMonth() &&
            calendarMonth.getFullYear() === now.getFullYear();

          return (
            <div
              key={idx}
              className={`min-h-[64px] sm:min-h-[74px] p-1.5 transition-all overflow-hidden flex flex-col justify-between ${
                !day
                  ? 'bg-muted/20 opacity-30'
                  : isWeekend
                  ? 'bg-rose-500/[0.02] dark:bg-rose-950/[0.08] select-none opacity-80'
                  : leaves.length > 0
                  ? `${dominantTheme?.cellTint} hover:bg-muted/20`
                  : 'bg-card hover:bg-primary/[0.02]'
              }`}
            >
              {day && (
                <>
                  {/* Top Bar: Date Number + Count indicator */}
                  <div className="flex items-center justify-between text-[10.5px] leading-none mb-1">
                    <span
                      className={`inline-flex items-center justify-center text-[10px] font-bold transition-all ${
                        isToday
                          ? 'h-5 w-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                          : isWeekend ? 'text-rose-500/60 dark:text-rose-400/60 font-medium' : 'text-foreground'
                      }`}
                    >
                      {day}
                    </span>

                    {!isWeekend && leaves.length > 0 && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-background/80 border shadow-2xs"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${dominantTheme?.dotColor}`} />
                        {leaves.length}
                      </span>
                    )}
                  </div>

                  {/* Weekend subtle tag */}
                  {isWeekend && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        Weekend
                      </span>
                    </div>
                  )}

                  {/* Leave Items List for Working Days */}
                  {!isWeekend && (
                    <div className="space-y-1 mt-auto">
                      {leaves.slice(0, 2).map((leave) => {
                        const isPending = (leave.status || '').toLowerCase() === 'pending';
                        const theme = getLeaveTypeTheme(leave.type);
                        const DeptIcon = getDepartmentIcon(leave.department);

                        const pillClasses = isPending ? theme.pendingPillBg : theme.pillBg;
                        return (
                          <button
                            key={leave.id}
                            type="button"
                            onClick={() => onSelectAbsence(leave)}
                            className={
                              'w-full text-left px-1.5 py-0.5 rounded-md text-[9px] font-medium ' +
                              'transition-all cursor-pointer truncate flex items-center ' +
                              `justify-between gap-1 border shadow-2xs ${pillClasses}`
                            }
                            title={`${leave.employeeName} (${theme.label}) - ${leave.status}`}
                          >
                            <div className="flex items-center gap-1 truncate">
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${theme.dotColor}`} />
                              <DeptIcon className="h-2.5 w-2.5 shrink-0 opacity-75" />
                              <span className="truncate font-semibold text-foreground">
                                {leave.employeeName?.split(' ')[0] || 'Staff'}
                              </span>
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0">
                              {isPending && <Clock className="h-2 w-2 text-amber-600 dark:text-amber-400" />}
                              <span className="font-mono text-[8.5px] opacity-80">{theme.shortLabel}</span>
                            </div>
                          </button>
                        );
                      })}

                      {leaves.length > 2 && (
                        <button
                          type="button"
                          onClick={() => onSelectAbsence(leaves[2])}
                          className="w-full text-center text-[8.5px] font-bold text-primary hover:underline py-0 cursor-pointer bg-primary/10 rounded"
                        >+{leaves.length - 2} more</button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
