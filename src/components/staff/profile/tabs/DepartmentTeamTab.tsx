'use client';

import { User, Users } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DepartmentPlacementOverview } from './team/DepartmentPlacementOverview';

interface DepartmentTeamTabProps {
  staff: StaffMember;
  onReassignDept: () => void;
  departmentColleagues?: StaffMember[];
}

export function DepartmentTeamTab({
  staff,
  onReassignDept,
  departmentColleagues = [],
}: DepartmentTeamTabProps) {
  const deptName = staff.departmentObj?.name || staff.department;
  const deptId = staff.departmentObj?.id || staff.departmentId || 'dept_unassigned';

  const managerName = staff.manager
    ? `${staff.manager.firstName || ''} ${staff.manager.lastName || ''}`.trim() || 'Assigned Manager'
    : staff.managerId || 'Department Head';

  return (
    <div className="space-y-6">
      {/* 1. Department Placement Overview */}
      <DepartmentPlacementOverview
        staff={staff}
        deptName={deptName}
        deptId={deptId}
        onReassignDept={onReassignDept}
      />

      {/* 2. Reporting Line / Manager Box */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-border/40">
          <User className="h-4 w-4 text-[#00A651]" /> Direct Supervisor / Manager
        </h4>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/70 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center font-bold text-sm text-foreground shadow-2xs">
              {managerName.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-0.5">
              <h5 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {managerName}
              </h5>
              <p className="text-xs text-muted-foreground font-mono">
                Manager ID: {staff.manager?.id || staff.managerId || 'usr_staff_head'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReassignDept}
            className="text-xs h-8 cursor-pointer"
          >
            Change Manager
          </Button>
        </div>
      </div>

      {/* 3. Department Colleagues (Headcount from Section 4.1) */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#00A651]" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Colleagues in {deptName}
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">
            {departmentColleagues.length} members
          </span>
        </div>

        {departmentColleagues.length > 0 ? (
          <div className="divide-y divide-border/40">
            {departmentColleagues.map((colleague) => (
              <div
                key={colleague.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted text-foreground font-bold text-xs flex items-center justify-center shrink-0">
                    {colleague.firstName?.[0]}
                    {colleague.lastName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {colleague.firstName} {colleague.lastName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{colleague.email}</p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="text-[10.5px] capitalize font-medium shrink-0"
                >
                  {colleague.status || 'Active'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground py-2 italic">
            This staff member is currently the primary member listed in this department.
          </p>
        )}
      </div>
    </div>
  );
}
