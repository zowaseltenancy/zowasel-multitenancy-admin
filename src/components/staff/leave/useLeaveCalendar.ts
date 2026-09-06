'use client';

import { useState, useMemo } from 'react';
import { LeaveRequest } from '@/types/staff';

export function useLeaveCalendar(requests: LeaveRequest[], defaultOpen: boolean) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(defaultOpen);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 8, 1)); // Sept 2026
  const [calendarDepartment, setCalendarDepartment] = useState<string>('all');
  const [includePending, setIncludePending] = useState<boolean>(true);

  const daysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const monthStartDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const totalDays = daysInMonth(calendarMonth);
    const startDay = monthStartDay(calendarMonth);
    const days: (number | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [calendarMonth]);

  const getLeavesForDate = (day: number) => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    // Ensure leave days highlighted on calendar strictly fall on working days (Mon-Fri), not weekends
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }

    return requests.filter((r) => {
      const isStatusOk =
        (r.status || '').toLowerCase() === 'approved' ||
        (includePending && (r.status || '').toLowerCase() === 'pending');
      if (!isStatusOk) return false;

      const inDateRange = r.startDate <= dateStr && r.endDate >= dateStr;
      if (!inDateRange) return false;

      if (calendarDepartment !== 'all') {
        const matchesDept =
          (r.department || '').toLowerCase() === calendarDepartment.toLowerCase();
        if (!matchesDept) return false;
      }

      return true;
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 2 + i);

  const prevMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    setCalendarMonth(new Date(2026, 8, 1));
  };

  return {
    isCalendarOpen,
    setIsCalendarOpen,
    calendarMonth,
    calendarDepartment,
    setCalendarDepartment,
    includePending,
    setIncludePending,
    calendarDays,
    getLeavesForDate,
    months,
    years,
    prevMonth,
    nextMonth,
    jumpToToday,
    selectMonth: (m: number) => setCalendarMonth(new Date(calendarMonth.getFullYear(), m, 1)),
    selectYear: (y: number) => setCalendarMonth(new Date(y, calendarMonth.getMonth(), 1)),
  };
}
