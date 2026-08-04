"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, UserCheck, Building2, Cpu, Layers, Landmark, TrendingUp, Wallet, ShieldCheck, Globe2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/features/users/hooks/useUsers";
import { StaffDepartment } from "@/types/user";

const DEPARTMENT_META: Record<StaffDepartment, { icon: typeof Building2; cardBg: string; iconClassName: string }> = {
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
  const { users } = useUsers();

  const staff = useMemo(() => users.filter((user) => user.userCategory === "staff"), [users]);

  const activeCount = staff.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zowasel Staff</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal Zowasel personnel, separate from platform/tenant users — {staff.length} staff across{" "}
          {DEPARTMENTS.length} departments, {activeCount} currently active.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {DEPARTMENTS.map((dept) => {
          const meta = DEPARTMENT_META[dept];
          const Icon = meta.icon;
          const count = staff.filter((s) => s.department === dept).length;

          return (
            <Link key={dept} href={`/admin/staff/directory?department=${encodeURIComponent(dept)}`} className="group block">
              <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}>
                <CardContent className="flex flex-col justify-between p-4 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{dept}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${meta.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="text-2xl font-bold">{count}</p>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

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
