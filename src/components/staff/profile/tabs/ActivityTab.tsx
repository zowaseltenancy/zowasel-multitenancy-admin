'use client';

import { useState } from 'react';
import { History } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { defaultFullActivities } from './activity/activityConstants';
import { ActivityTimelineItem } from './activity/ActivityTimelineItem';

interface ActivityTabProps {
  staff: StaffMember;
}

const FILTER_OPTIONS = [
  { key: 'all', label: 'All Events' },
  { key: 'profile_updated', label: 'Profile' },
  { key: 'document_uploaded', label: 'Documents' },
  { key: 'security', label: 'Security' },
] as const;

export function ActivityTab({ staff }: ActivityTabProps) {
  const allActivities =
    staff.activities && staff.activities.length > 0 ? staff.activities : defaultFullActivities;

  const [filterType, setFilterType] = useState<string>('all');

  const filtered =
    filterType === 'all'
      ? allActivities
      : allActivities.filter((a) => a.type === filterType || (filterType === 'security' && a.type === 'password_reset'));

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      {/* 1. Header with Filters */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-[#00A651]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Chronological Audit Trail & Activity
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable log of staff profile modifications, credential resets, and compliance events.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filterType === f.key
                  ? 'bg-[#00A651] text-white shadow-2xs'
                  : 'bg-muted/40 hover:bg-muted text-muted-foreground border border-border/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Vertical Timeline */}
      <div className="p-5 sm:p-6">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {filtered.map((activity, idx) => (
            <ActivityTimelineItem key={activity.id || idx} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
