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

export function calculateWorkingDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
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
    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-semibold gap-1">
      <Clock className="h-3 w-3" /> Pending
    </Badge>
  );
}
