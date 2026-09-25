'use client';

import Link from 'next/link';
import { ArrowRight, Eye, Lock, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getDepartmentTheme } from './departmentMeta';

export interface DepartmentCount {
  id: string;
  name: string;
  count: number;
}

interface StaffDepartmentGridProps {
  /**
   * The real departments, from GET /admin/staff/stats — which returns every
   * one including those with no staff, so an empty department still gets a
   * card. This replaced a hardcoded list of nine names: only three matched
   * the actual departments, so four cards read zero permanently and the staff
   * in the unlisted ones were counted nowhere.
   */
  departments: DepartmentCount[];
}

export function StaffDepartmentGrid({ departments }: StaffDepartmentGridProps) {
  if (departments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
        <p className="text-sm font-medium text-foreground">No departments yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Create one from Staff &rsaquo; Departments to start placing staff.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {departments.map(({ id, name: dept, count }) => {
        const meta = getDepartmentTheme(dept);
        const Icon = meta.icon;

        return (
          <div key={id} className="group relative">
            <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}>
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
                    href={`/admin/staff/directory?departmentId=${id}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    title="View Staff"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/admin/staff/permissions?departmentId=${id}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    title="Manage Permissions"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Permissions
                  </Link>
                  <Link
                    href={`/admin/staff/leave?departmentId=${id}`}
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
  );
}