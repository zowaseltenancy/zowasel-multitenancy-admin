'use client';

import { HeartHandshake } from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface NextOfKinSectionProps {
  nextOfKin?: StaffMember['nextOfKin'];
}

export function NextOfKinSection({ nextOfKin }: NextOfKinSectionProps) {
  return (
    <div className="p-5 sm:p-6 space-y-4">
      <div className="flex items-center gap-2 pb-1 border-b border-border/40">
        <HeartHandshake className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Emergency Contact & Next of Kin
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <span className="text-[11px] text-muted-foreground block">Full Name</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
            {nextOfKin?.fullName || 'Sarah Emmanuel'}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Relationship</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
            {nextOfKin?.relationship || 'Spouse'}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Emergency Phone</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
            {nextOfKin?.phone || '+234 802 345 6789'}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Emergency Email</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
            {nextOfKin?.email || 'sarah.emmanuel@example.com'}
          </p>
        </div>
      </div>
    </div>
  );
}