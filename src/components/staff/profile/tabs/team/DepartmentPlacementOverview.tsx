'use client';

import { Building2, MapPin } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface DepartmentPlacementOverviewProps {
  staff: StaffMember;
  deptName: string;
  deptId: string;
  onReassignDept: () => void;
}

export function DepartmentPlacementOverview({
  staff,
  deptName,
  deptId,
  onReassignDept,
}: DepartmentPlacementOverviewProps) {
  const DeptIcon = getDepartmentIcon(staff.department);

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#00A651]/10 text-[#00A651] flex items-center justify-center shrink-0">
            <DeptIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {deptName}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Department ID: {deptId}
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onReassignDept}
          className="h-8.5 bg-[#00A651] hover:bg-[#008C44] text-white font-medium text-xs gap-1.5 shadow-xs cursor-pointer"
        >
          <Building2 className="h-3.5 w-3.5" /> Reassign Department / Manager
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
        <div className="rounded-xl border border-border/70 p-3.5 space-y-1 bg-muted/20">
          <span className="text-[11px] font-semibold text-muted-foreground block">
            Work Location / Hub
          </span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{staff.country ? `${staff.country} (HQ Hub)` : 'Victoria Island, Lagos'}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border/70 p-3.5 space-y-1 bg-muted/20">
          <span className="text-[11px] font-semibold text-muted-foreground block">
            Employment Terms
          </span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize text-sm">
            {staff.employmenttype || staff.employmentType || 'Full-time'}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 p-3.5 space-y-1 bg-muted/20">
          <span className="text-[11px] font-semibold text-muted-foreground block">
            Department Status
          </span>
          <div className="pt-0.5">
            <Badge
              variant="outline"
              className="text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10"
            >
              Active Department
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}