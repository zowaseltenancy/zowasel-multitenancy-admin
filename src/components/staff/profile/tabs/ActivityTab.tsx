'use client';

import { useState } from 'react';
import {
  History,
  UserCog,
  FileCheck,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  CircleDot,
  Filter,
} from 'lucide-react';
import { StaffActivity, StaffMember } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

interface ActivityTabProps {
  staff: StaffMember;
}

export function ActivityTab({ staff }: ActivityTabProps) {
  const defaultFullActivities: StaffActivity[] = [
    {
      id: 'act-1',
      type: 'profile_updated',
      title: 'Profile information updated',
      description: 'Permanent residential address and Next of Kin contact numbers verified and updated.',
      actor: 'Zowasel Admin',
      timestamp: '2 days ago · Aug 30, 2026 at 14:22',
    },
    {
      id: 'act-2',
      type: 'document_uploaded',
      title: 'Annual Compliance Contract uploaded',
      description: 'Uploaded and verified Employment Contract & NDA Agreement in encrypted personnel store.',
      actor: 'HR Operations (Amina Bello)',
      timestamp: '5 days ago · Aug 27, 2026 at 09:15',
    },
    {
      id: 'act-3',
      type: 'role_assigned',
      title: 'Department Role Scope Assigned',
      description: 'Assigned Lead Field Officer permissions for CropPilot verification clusters.',
      actor: 'System Admin',
      timestamp: '1 week ago · Aug 24, 2026 at 11:30',
    },
    {
      id: 'act-4',
      type: 'password_reset',
      title: 'Administrative password reset executed',
      description: 'Temporary security credentials dispatched to staff official work email.',
      actor: 'Security Operations',
      timestamp: '2 weeks ago · Aug 17, 2026 at 16:45',
    },
    {
      id: 'act-5',
      type: 'review_completed',
      title: 'Q2 Performance Appraisal verified',
      description: 'Completed annual yield audit rating of 4.9/5.0 with supervisor feedback.',
      actor: 'Dr. Chuka Eze (VP Agronomy)',
      timestamp: '1 month ago · Aug 01, 2026 at 10:00',
    },
    {
      id: 'act-6',
      type: 'general',
      title: 'Staff Onboarding dossier provisioned',
      description: 'Initial employee record created and provisioned on Zowasel multi-tenant directory.',
      actor: 'Zowasel HR System',
      timestamp: 'Jan 15, 2023 at 08:00',
    },
  ];

  const allActivities =
    staff.activities && staff.activities.length > 0 ? staff.activities : defaultFullActivities;

  const [filterType, setFilterType] = useState<string>('all');

  const filtered =
    filterType === 'all'
      ? allActivities
      : allActivities.filter((a) => a.type === filterType || (filterType === 'security' && a.type === 'password_reset'));

  const getActivityIcon = (type: StaffActivity['type']) => {
    switch (type) {
      case 'profile_updated':
        return <UserCog className="h-4 w-4 text-blue-500" />;
      case 'document_uploaded':
        return <FileCheck className="h-4 w-4 text-[#00A651]" />;
      case 'password_reset':
        return <KeyRound className="h-4 w-4 text-amber-500" />;
      case 'review_completed':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'role_assigned':
        return <ShieldCheck className="h-4 w-4 text-[#00A651]" />;
      default:
        return <CircleDot className="h-4 w-4 text-slate-500" />;
    }
  };

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
          {[
            { key: 'all', label: 'All Events' },
            { key: 'profile_updated', label: 'Profile' },
            { key: 'document_uploaded', label: 'Documents' },
            { key: 'security', label: 'Security' },
          ].map((f) => (
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
            <div key={activity.id || idx} className="relative group">
              {/* Timeline Dot Icon */}
              <div className="absolute -left-6 mt-0.5 h-6 w-6 rounded-full bg-card border-2 border-border/80 shadow-2xs flex items-center justify-center group-hover:border-[#00A651] transition-colors">
                {getActivityIcon(activity.type)}
              </div>

              {/* Event Content Card */}
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 hover:bg-muted/30 transition-colors space-y-1 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    {activity.title}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {activity.description}
                </p>

                <div className="flex items-center gap-2 pt-1 text-[10.5px] text-muted-foreground">
                  <span>Actor:</span>
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                    {activity.actor}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
