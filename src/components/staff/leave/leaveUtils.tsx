import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const CURRENT_USER = {
  id: 'staff-alice',
  name: 'Alice Johnson',
  department: 'Technology',
};

export const LEAVE_BALANCES = {
  Annual: { total: 20, taken: 4 },
  Sick: { total: 10, taken: 0 },
  Casual: { total: 5, taken: 1 },
  Unpaid: { total: 0, taken: 0 },
};

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function calculateWorkingDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    if (!isWeekend(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export interface LeaveTypeTheme {
  label: string;
  shortLabel: string;
  dotColor: string;
  textColor: string;
  pillBg: string;
  pendingPillBg: string;
  cellTint: string;
  badgeClass: string;
  legendBgClass: string;
}

const mkTheme = (
  label: string,
  shortLabel: string,
  color: string,
  darkText: string
): LeaveTypeTheme => ({
  label,
  shortLabel,
  dotColor: `bg-${color}-500`,
  textColor: `text-${color}-700 dark:${darkText}`,
  pillBg: `bg-${color}-500/15 border-${color}-500/40 text-${color}-800 dark:text-${color}-200 hover:bg-${color}-500/25`,
  pendingPillBg: `bg-${color}-500/10 border-dashed border-amber-500/60 text-${color}-900 dark:text-${color}-200 hover:bg-${color}-500/20`,
  cellTint: `bg-${color}-500/[0.04] dark:bg-${color}-500/[0.08]`,
  badgeClass: `bg-${color}-100 text-${color}-800 border-${color}-300 dark:bg-${color}-900/40 dark:${darkText}`,
  legendBgClass: `bg-${color}-500/10 border-${color}-500/30`,
});

export const LEAVE_TYPE_THEMES: Record<string, LeaveTypeTheme> = {
  sick: mkTheme('Sick Leave', 'Sick', 'rose', 'text-rose-300'),
  casual: mkTheme('Casual / Personal', 'Casual', 'blue', 'text-blue-300'),
  parental: mkTheme('Maternity / Paternity', 'Parental', 'purple', 'text-purple-300'),
  unpaid: mkTheme('Unpaid Leave', 'Unpaid', 'amber', 'text-amber-300'),
  annual: mkTheme('Annual Leave', 'Annual', 'emerald', 'text-emerald-300'),
};

export function getLeaveTypeTheme(type?: string): LeaveTypeTheme {
  const norm = (type || '').toLowerCase();
  if (norm.includes('sick')) return LEAVE_TYPE_THEMES.sick;
  if (
    norm.includes('casual') ||
    norm.includes('personal') ||
    norm.includes('compassionate') ||
    norm.includes('bereavement')
  ) {
    return LEAVE_TYPE_THEMES.casual;
  }
  if (norm.includes('matern') || norm.includes('patern')) return LEAVE_TYPE_THEMES.parental;
  if (norm.includes('unpaid')) return LEAVE_TYPE_THEMES.unpaid;
  return LEAVE_TYPE_THEMES.annual;
}

export const LEAVE_TYPE_LEGEND = [
  { label: 'Annual', themeKey: 'annual' },
  { label: 'Sick', themeKey: 'sick' },
  { label: 'Casual', themeKey: 'casual' },
  { label: 'Parental', themeKey: 'parental' },
  { label: 'Unpaid', themeKey: 'unpaid' },
].map(({ label, themeKey }) => ({
  label,
  color: LEAVE_TYPE_THEMES[themeKey].dotColor,
  textClass: LEAVE_TYPE_THEMES[themeKey].textColor,
  bgClass: LEAVE_TYPE_THEMES[themeKey].legendBgClass,
}));

export function StatusBadge({ status }: { status: string }) {
  const lower = (status || '').toLowerCase();
  if (lower === 'approved') {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold gap-1">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </Badge>
    );
  }
  if (lower === 'rejected') {
    return (
      <Badge variant="destructive" className="text-[11px] font-semibold gap-1">
        <XCircle className="h-3 w-3" /> Rejected
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-semibold gap-1"
    >
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );
}
