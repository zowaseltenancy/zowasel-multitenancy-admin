'use client';

import {
  History,
  ArrowRight,
  UserCog,
  FileCheck,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  CircleDot,
} from 'lucide-react';
import { StaffActivity } from '@/types/staff';

interface RecentActivityCardProps {
  activities?: StaffActivity[];
  onViewAllActivity: () => void;
}

export function RecentActivityCard({ activities, onViewAllActivity }: RecentActivityCardProps) {
  const defaultActivities: StaffActivity[] = [
    {
      id: 'act-1',
      type: 'profile_updated',
      title: 'Profile updated',
      description: 'Personal bio and contact information revised',
      actor: 'Zowasel Admin',
      timestamp: '2 days ago',
    },
    {
      id: 'act-2',
      type: 'document_uploaded',
      title: 'Document uploaded',
      description: 'Annual compliance and work agreement attached',
      actor: 'HR Operations',
      timestamp: '5 days ago',
    },
    {
      id: 'act-3',
      type: 'password_reset',
      title: 'Password reset',
      description: 'Administrative credential update initiated',
      actor: 'System Security',
      timestamp: '2 weeks ago',
    },
    {
      id: 'act-4',
      type: 'review_completed',
      title: 'Performance review completed',
      description: 'Q2 Agronomy yield and field ops audit verified',
      actor: 'Department Lead',
      timestamp: '1 month ago',
    },
  ];

  const displayList = activities && activities.length > 0 ? activities.slice(0, 4) : defaultActivities;

  const getActivityIcon = (type: StaffActivity['type']) => {
    switch (type) {
      case 'profile_updated':
        return <UserCog className="h-3.5 w-3.5 text-blue-500" />;
      case 'document_uploaded':
        return <FileCheck className="h-3.5 w-3.5 text-[#00A651]" />;
      case 'password_reset':
        return <KeyRound className="h-3.5 w-3.5 text-amber-500" />;
      case 'review_completed':
        return <TrendingUp className="h-3.5 w-3.5 text-purple-500" />;
      case 'role_assigned':
        return <ShieldCheck className="h-3.5 w-3.5 text-[#00A651]" />;
      default:
        return <CircleDot className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Recent Activity
          </h3>
        </div>

        <button
          type="button"
          onClick={onViewAllActivity}
          className="text-xs font-semibold text-[#008C44] dark:text-[#00C862] hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {displayList.map((activity, idx) => (
          <div key={activity.id || idx} className="flex items-start gap-2.5 text-xs">
            <div className="h-6 w-6 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center shrink-0 mt-0.5">
              {getActivityIcon(activity.type)}
            </div>

            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {activity.title}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
