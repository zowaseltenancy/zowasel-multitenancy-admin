'use client';

import React from 'react';
import { LeaveRequest } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface CalendarMatrixGridProps {
  calendarDays: (number | null)[];
  calendarMonth: Date;
  getLeavesForDate: (day: number) => LeaveRequest[];
  onSelectAbsence: (leave: LeaveRequest) => void;
}

export function CalendarMatrixGrid({
  calendarDays,
  calendarMonth,
  getLeavesForDate,
  onSelectAbsence,
}: CalendarMatrixGridProps) {
  return (
    <div className="p-0">
      {/* Calendar Grid Header */}
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20 text-center text-[10.5px] font-semibold text-muted-foreground">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <div key={d} className={`py-1 ${i === 0 || i === 6 ? 'text-muted-foreground/60' : 'text-foreground'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div className="grid grid-cols-7 gap-px bg-border/50">
        {calendarDays.map((day, idx) => {
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          // Only query and render leave highlights for working days (Monday - Friday), never weekends
          const leaves = day && !isWeekend ? getLeavesForDate(day) : [];
          const isToday =
            day === new Date().getDate() &&
            calendarMonth.getMonth() === new Date().getMonth() &&
            calendarMonth.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={idx}
              className={`h-12 sm:h-13 p-1 transition-colors overflow-hidden ${
                day
                  ? isWeekend
                    ? 'bg-muted/20 select-none'
                    : leaves.length > 0
                      ? 'bg-emerald-500/[0.05] dark:bg-emerald-500/[0.08] hover:bg-muted/10'
                      : 'bg-card hover:bg-muted/10'
                  : 'bg-muted/25 opacity-30'
              }`}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between text-[10px] leading-none mb-0.5">
                    <span
                      className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-full text-[9.5px] font-bold ${
                        isToday
                          ? 'bg-[#44883C] text-white'
                          : isWeekend
                            ? 'text-muted-foreground/45'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {day}
                    </span>
                    {!isWeekend && leaves.length > 0 && (
                      <span className="text-[8.5px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {leaves.length}
                      </span>
                    )}
                  </div>

                  {!isWeekend && (
                    <div className="space-y-0.5">
                      {leaves.slice(0, 1).map((leave) => {
                        const isPending = (leave.status || '').toLowerCase() === 'pending';
                        const DeptIcon = getDepartmentIcon(leave.department);

                        return (
                          <button
                            key={leave.id}
                            type="button"
                            onClick={() => onSelectAbsence(leave)}
                            className={`w-full text-left px-1 py-0.5 rounded text-[8.5px] transition-all cursor-pointer truncate flex items-center gap-0.5 border ${
                              isPending
                                ? 'bg-amber-500/10 border-dashed border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 font-medium'
                            }`}
                          >
                            <DeptIcon className="h-2 w-2 shrink-0 opacity-70" />
                            <span className="truncate font-semibold">
                              {leave.employeeName?.split(' ')[0] || 'Staff'}
                            </span>
                            <span className="opacity-70 shrink-0 font-mono text-[8px]">
                              ({leave.type[0]})
                            </span>
                          </button>
                        );
                      })}

                      {leaves.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onSelectAbsence(leaves[1])}
                          className="w-full text-center text-[8px] font-semibold text-muted-foreground hover:text-foreground py-0 cursor-pointer"
                        >
                          +{leaves.length - 1} more
                        </button>
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
