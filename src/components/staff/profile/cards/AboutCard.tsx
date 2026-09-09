'use client';

import { User } from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface AboutCardProps {
  staff: StaffMember;
}

export function AboutCard({ staff }: AboutCardProps) {
  const defaultBio = `${staff.firstName} is an experienced professional in the ${staff.department} department at Zowasel, contributing to core platform operations, stakeholder engagement, and strategic cross-functional initiatives.`;

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-2.5">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <User className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
          About {staff.firstName}
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {staff.bio || defaultBio}
      </p>
    </div>
  );
}
