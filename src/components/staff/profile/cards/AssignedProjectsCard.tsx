'use client';

import { FolderKanban, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { StaffProject } from '@/types/staff';

interface AssignedProjectsCardProps {
  projects?: StaffProject[];
  onViewAllProjects: () => void;
}

export function AssignedProjectsCard({ projects, onViewAllProjects }: AssignedProjectsCardProps) {
  // Default mock projects if none provided
  const sampleProjects: StaffProject[] = [
    {
      id: 'proj-1',
      name: 'CropPilot Data Collection',
      description: 'Data collection, ground verification, and farmer biometric profiling for the 2024 harvest season.',
      status: 'active',
      startDate: 'Jan 2024',
      endDate: 'Dec 2024',
      progress: 75,
    },
    {
      id: 'proj-2',
      name: 'Farmer Engagement Program',
      description: 'District community engagement, digital agronomy training workshops, and cooperative onboarding.',
      status: 'active',
      startDate: 'Mar 2024',
      endDate: 'Feb 2025',
      progress: 45,
    },
  ];

  const displayProjects = projects && projects.length > 0 ? projects.slice(0, 2) : sampleProjects;

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Assigned Projects
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAllProjects}
          className="text-xs font-semibold text-[#008C44] dark:text-[#00C862] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all projects <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {displayProjects.map((project) => (
          <div
            key={project.id}
            className="p-3.5 rounded-xl bg-muted/20 border border-border/60 hover:bg-muted/30 transition-colors space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                {project.name}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold capitalize text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10 px-2 py-0.2"
              >
                {project.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
              {project.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{project.startDate} – {project.endDate || 'Present'}</span>
              </span>

              {typeof project.progress === 'number' && (
                <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                  {project.progress}% completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
