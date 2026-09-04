'use client';

import { FolderKanban, Building } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

interface ProjectsAndHistorySectionProps {
  staff: StaffMember;
}

export function ProjectsAndHistorySection({
  staff,
  departmentRoles = [],
}: ProjectsAndHistorySectionProps) {
  return (
    <>
      {/* Assigned Projects */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Assigned Projects & Key Initiatives
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {(staff.projects && staff.projects.length > 0
            ? staff.projects
            : [
                {
                  id: 'p1',
                  name: 'CropPilot Data Collection',
                  description:
                    'Data collection, farm perimeter mapping, and harvest verification across 12 farmer clusters.',
                  status: 'active',
                  startDate: 'Jan 2024',
                  endDate: 'Dec 2024',
                  progress: 75,
                },
                {
                  id: 'p2',
                  name: 'Farmer Engagement Program',
                  description:
                    'Digital literacy, micro-lending workshops, and smartphone cooperative training.',
                  status: 'active',
                  startDate: 'Mar 2024',
                  endDate: 'Feb 2025',
                  progress: 45,
                },
              ]
          ).map((project) => (
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

              <p className="text-xs text-slate-600 dark:text-slate-300">{project.description}</p>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span>
                  {project.startDate} – {project.endDate || 'Present'}
                </span>
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

      {/* Prior Experience */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Prior Professional Experience
          </h3>
        </div>

        {staff.workExperience &&
        staff.workExperience.length > 0 &&
        staff.workExperience.some((w) => w.company || w.jobTitle) ? (
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
    </>
  );
}