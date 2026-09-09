'use client';

import { Briefcase, MapPin, FileCheck2 } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface PlacementSectionProps {
  staff: StaffMember;
  roleName: string;
}

export function PlacementSection({ staff, roleName }: PlacementSectionProps) {
  const DeptIcon = getDepartmentIcon(staff.department);

  const formatDate = (dateStr?: string) => {
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
  };

  return (
    <>
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#00A651]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Corporate Placement & Terms
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10"
          >
            {staff.status === 'active' ? 'Active Assignment' : 'Inactive'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Corporate Designation</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{roleName}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Department</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 flex items-center gap-1.5">
              <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{staff.department}</span>
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Staff / Employee ID</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 font-mono">
              {staff.employeeId || '—'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Direct Supervisor / Manager</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5 font-mono">
              {staff.managerId || 'STAFF-HEAD-001'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Employment Type</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize mt-0.5">
              {staff.employmentType || 'Full-time'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Date of Joining</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatDate(staff.dateJoined)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[11px] text-muted-foreground block">Assigned Work Location / Hub</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{staff.workLocation || 'HQ - Victoria Island, Lagos'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Contract & Terms of Service
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Contract Model</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Indefinite / Permanent</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Probation Status</span>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Confirmed Staff</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Work Schedule</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Monday – Friday (40 hrs/wk)</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Notice Period</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">1 Month Standard</p>
          </div>
        </div>
      </div>
    </>
  );
}