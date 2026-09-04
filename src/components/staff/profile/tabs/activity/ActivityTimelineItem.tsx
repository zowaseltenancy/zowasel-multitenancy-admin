import {
  UserCog,
  FileCheck,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  CircleDot,
} from 'lucide-react';
import { StaffActivity } from '@/types/staff';
import { Badge } from '@/components/ui/badge';

function getActivityIcon(type: StaffActivity['type']) {
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
}

interface ActivityTimelineItemProps {
  activity: StaffActivity;
}

export function ActivityTimelineItem({ activity }: ActivityTimelineItemProps) {
  return (
    <div className="relative group">
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
  );
}