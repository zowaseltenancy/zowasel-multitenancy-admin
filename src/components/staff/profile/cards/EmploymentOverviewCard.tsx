'use client';

import { Briefcase, ArrowRight, Building2, MapPin, CalendarDays, Users } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface EmploymentOverviewCardProps {
  staff: StaffMember;
  roleName: string;
  onViewFullDetails: () => void;
}

export function EmploymentOverviewCard({ staff, roleName, onViewFullDetails }: EmploymentOverviewCardProps) {
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
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-[#44883C]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Employment Overview
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewFullDetails}
          className="text-xs font-semibold text-[#44883C] dark:text-[#5cb850] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View department & team <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-4 text-xs">
        <div>
          <span className="text-[11px] text-muted-foreground block">Department</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
            <DeptIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{staff.department}</span>
          </p>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">Position</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">{roleName}</p>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">Employment Type</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize mt-0.5">
            {staff.employmentType || 'Full-time'}
          </p>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">Reporting To</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
            <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{staff.managerId || 'Department Head'}</span>
          </p>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">Work Location</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="truncate">{staff.workLocation || 'HQ - Lagos, Nigeria'}</span>
          </p>
        </div>

        <div>
          <span className="text-[11px] text-muted-foreground block">Date Joined</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-0.5">
            <CalendarDays className="h-3 w-3 text-muted-foreground shrink-0" />
            <span>{formatDate(staff.dateJoined)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
