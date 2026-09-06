'use client';

import Link from 'next/link';
import {
  Users,
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
        <Card className="border border-cyan-500/20 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 border border-cyan-500/30 dark:text-cyan-400 shadow-xs shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">Total Staff</p>
              <p className="text-2xl font-extrabold text-foreground font-mono">{totalStaff}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 dark:text-emerald-400 shadow-xs shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Active Staff</p>
              <p className="text-2xl font-extrabold text-foreground font-mono">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 shadow-2xs hover:shadow-xs transition-all">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 dark:text-amber-400 shadow-xs shrink-0">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Leave Requests</p>
              <p className="text-2xl font-extrabold text-foreground font-mono">{pendingLeaveCount}</p>
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