'use client';

import Link from 'next/link';
import {
  UserCheck,
  CalendarClock,
  UserPlus,
  Shield,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StaffDashboardSummaryProps {
  totalStaff: number;
  activeCount: number;
  departmentCount: number;
  pendingLeaveCount: number;
}

export function StaffDashboardSummary({
  totalStaff,
  activeCount,
  departmentCount,
  pendingLeaveCount,
}: StaffDashboardSummaryProps) {
  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zowasel Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal Zowasel personnel, separate from platform/tenant users —{' '}
          {totalStaff} staff across {departmentCount} departments,{' '}
          {activeCount} currently active.
        </p>
      </div>

      {/* Global Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/staff/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Link>
        <Link
          href="/admin/staff/leave/request"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <CalendarClock className="h-4 w-4" />
          Request Leave
        </Link>
        <Link
          href="/admin/staff/roles"
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Shield className="h-4 w-4" />
          Manage Roles
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-blue-200/80 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/70 via-card to-card dark:from-blue-950/30 dark:via-card dark:to-card shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{totalStaff}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-200/80 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/70 via-card to-card dark:from-emerald-950/30 dark:via-card dark:to-card shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A651] text-white shadow-xs shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#008C44] dark:text-[#00C862] uppercase tracking-wider">Active Staff</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200/80 dark:border-amber-900/60 bg-gradient-to-br from-amber-50/70 via-card to-card dark:from-amber-950/30 dark:via-card dark:to-card shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Leave Requests</p>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{pendingLeaveCount}</p>
              <Link
                href="/admin/staff/leave"
                className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline"
              >
                Review →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}