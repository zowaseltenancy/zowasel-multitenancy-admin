"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  UserCheck,
  Building2,
  Cpu,
  Layers,
  Landmark,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Globe2,
  CalendarClock,
  UserPlus,
  Shield,
  Eye,
  Lock,
  CalendarDays,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useDepartments, useStaff } from "@/features/staff/hooks/useStaff";
import { StaffDepartment } from "@/types/user";

const DEPARTMENT_META: Record<
  StaffDepartment,
  { icon: typeof Building2; cardBg: string; iconClassName: string }
> = {
  Executive: {
    icon: Building2,
    cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
    iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
  },
  Technology: {
    icon: Cpu,
    cardBg: "bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/20",
    iconClassName: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
  },
  Programs: {
    icon: Layers,
    cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
    iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  Fintech: {
    icon: Wallet,
    cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
    iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  Sales: {
    icon: TrendingUp,
    cardBg: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20",
    iconClassName: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
  },
  Finance: {
    icon: Landmark,
    cardBg: "bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/20",
    iconClassName: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:text-purple-400",
  },
  Administration: {
    icon: UserCheck,
    cardBg: "bg-slate-500/5 dark:bg-slate-500/10 border-slate-500/20",
    iconClassName: "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-400",
  },
  Compliance: {
    icon: ShieldCheck,
    cardBg: "bg-red-500/5 dark:bg-red-500/10 border-red-500/30",
    iconClassName: "bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400",
  },
  "Regional Operations": {
    icon: Globe2,
    cardBg: "bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/20",
    iconClassName: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:text-teal-400",
  },
};

const DEPARTMENTS = Object.keys(DEPARTMENT_META) as StaffDepartment[];

export default function ZowaselStaffOverviewPage() {
  // GET /admin/staff — the `admins` table, which is what "Zowasel staff" means.
  // This previously filtered the mock user list on userCategory === "staff";
  // real staff are a separate table reached by a different endpoint, not a
  // subset of tenant users.
  const { staff, meta } = useStaff({ page: 1, limit: 100 });
  // GET /admin/departments, rather than the hardcoded DEPARTMENT_META keys —
  // the real departments are Sales, Operations, Compliance, Finance and
  // People & Culture, none of which appear in that constant.
  const { departments } = useDepartments();

  const totalStaff = meta?.total ?? staff.length;
  const activeCount = staff.filter((member) => member.status === "ACTIVE").length;

  // No endpoint for a platform-wide pending-leave count: the leave overview is
  // GET /admin/leave/requests/overview, gated on leave:review, and returns rows
  // rather than a tally. Left at zero until that is wired.
  const pendingLeaveCount = 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zowasel Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal Zowasel personnel, separate from platform/tenant users —{" "}
          {totalStaff} staff across {departments.length || DEPARTMENTS.length} departments,{" "}
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
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 border border-blue-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{totalStaff}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600 border border-orange-500/30">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Leave Requests</p>
              <p className="text-2xl font-bold">{pendingLeaveCount}</p>
              <Link
                href="/admin/staff/leave"
                className="text-xs text-primary hover:underline"
              >
                Review →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Cards with Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DEPARTMENTS.map((dept) => {
          const meta = DEPARTMENT_META[dept];
          const Icon = meta.icon;
          const count = staff.filter((member) => member.department?.name === dept).length;

          return (
            <div key={dept} className="group relative">
              <Card
                className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}
              >
                <CardContent className="flex flex-col justify-between p-4 min-h-[140px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {dept}
                    </p>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.iconClassName}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-2xl font-bold">{count}</p>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>

                  {/* Quick action links */}
                  <div className="mt-3 flex items-center gap-2 border-t pt-2">
                    <Link
                      href={`/admin/staff/directory?department=${encodeURIComponent(dept)}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      title="View Staff"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                    <Link
                      href={`/admin/staff/permissions?department=${encodeURIComponent(dept)}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      title="Manage Permissions"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Permissions
                    </Link>
                    <Link
                      href={`/admin/staff/leave?department=${encodeURIComponent(dept)}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      title="Leave Requests"
                    >
                      <CalendarDays className="h-3.5 w-3.5" />
                      Leave
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Full directory link */}
      <Link
        href="/admin/staff/directory"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        <UserCheck className="h-4 w-4" />
        View Full Staff Directory
      </Link>
    </div>
  );
}