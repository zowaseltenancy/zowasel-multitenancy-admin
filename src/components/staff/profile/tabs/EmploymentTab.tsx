'use client';

import {
  Briefcase,
  Building2,
  CalendarDays,
  Users,
  MapPin,
  FileCheck2,
  FolderKanban,
  Building,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { StaffMember, DepartmentRole } from '@/types/staff';
import { Badge } from '@/components/ui/badge';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface EmploymentTabProps {
  staff: StaffMember;
  roleName: string;
  departmentRoles?: DepartmentRole[];
}

export function EmploymentTab({ staff, roleName, departmentRoles = [] }: EmploymentTabProps) {
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
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      
      {/* 1. Placement & Corporate Designation */}
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

      {/* 2. Contract & Service Terms */}
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

      {/* 3. Assigned Projects & Initiatives */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Assigned Projects & Key Initiatives
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(staff.projects && staff.projects.length > 0 ? staff.projects : [
            {
              id: 'p1',
              name: 'CropPilot Data Collection',
              description: 'Data collection, farm perimeter mapping, and harvest verification across 12 farmer clusters.',
              status: 'active',
              startDate: 'Jan 2024',
              endDate: 'Dec 2024',
              progress: 75,
            },
            {
              id: 'p2',
              name: 'Farmer Engagement Program',
              description: 'Digital literacy, micro-lending workshops, and smartphone cooperative training.',
              status: 'active',
              startDate: 'Mar 2024',
              endDate: 'Feb 2025',
              progress: 45,
            },
          ]).map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {project.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] capitalize text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10 px-2"
                >
                  {project.status}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {project.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span>{project.startDate} – {project.endDate || 'Present'}</span>
                {typeof project.progress === 'number' && (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {project.progress}% completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Prior Professional Experience */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Prior Professional Experience
          </h3>
        </div>

        {staff.workExperience && staff.workExperience.length > 0 && staff.workExperience.some((w) => w.company || w.jobTitle) ? (
          <div className="space-y-3">
            {staff.workExperience.map((exp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    {exp.jobTitle || 'Role'} at {exp.company || 'Company'}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {exp.startDate || '—'} – {exp.endDate || '—'}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 pt-0.5">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No prior employment history recorded.</p>
        )}
      </div>

      {/* 5. Department Roles & Scoped Permissions */}
      {departmentRoles && departmentRoles.length > 0 && (
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#00A651]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Scoped Department Roles & Access Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {departmentRoles.map((role) => (
              <div key={role.id} className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                    {role.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] text-[#008C44] dark:text-[#00C862] border-[#00A651]/30">
                    {role.departmentId}
                  </Badge>
                </div>
                {Array.isArray(role.permissions) ? (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {role.permissions.map((p) => (
                      <Badge key={p} variant="secondary" className="text-[10px] font-mono">
                        {p}
                      </Badge>
                    ))}
                  </div>
                ) : role.permissions ? (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {Object.entries(role.permissions).map(([mod, perms]) => (
                      <span
                        key={mod}
                        className="px-2 py-0.5 bg-card border rounded text-[10px] font-mono text-muted-foreground"
                      >
                        {mod}: {typeof perms === 'object' ? Object.keys(perms).filter((k) => (perms as any)[k]).join('/') : perms}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
