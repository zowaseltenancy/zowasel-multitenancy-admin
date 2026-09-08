'use client';

import { Badge } from '@/components/ui/badge';
import { Camera, CalendarDays, Clock } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { StaffQuickContactMeta } from './StaffQuickContactMeta';

interface StaffIdentityCardProps {
  staff: StaffMember;
  roleName: string;
  onEditPhoto: () => void;
}

export function StaffIdentityCard({ staff, roleName, onEditPhoto }: StaffIdentityCardProps) {
  const initials = `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase() || 'ZS';
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

  const isSuspended = staff.status?.toLowerCase() === 'suspended' || staff.status?.toLowerCase() === 'inactive';
  const isInvited = staff.status?.toLowerCase() === 'invited';

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          {/* Avatar with Camera trigger */}
          <div className="relative group shrink-0">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={`${staff.firstName} ${staff.lastName}`}
                className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl object-cover border-2 border-border/80 shadow-xs"
              />
            ) : (
              <div className="h-20 w-20 sm:h-22 sm:w-22 rounded-2xl bg-muted text-foreground font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-2 border-border/80 shadow-xs">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={onEditPhoto}
              aria-label="Update staff photo"
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-card border border-border shadow-xs flex items-center justify-center text-muted-foreground hover:text-[#00A651] hover:border-[#00A651]/50 transition-all cursor-pointer"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Info Hierarchy */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {staff.firstName} {staff.lastName}
              </h2>

              <Badge
                variant="outline"
                className={`text-[11px] font-semibold px-2 py-0.5 ${
                  !isSuspended && !isInvited
                    ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                    : isInvited
                    ? 'text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10'
                    : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                    !isSuspended && !isInvited ? 'bg-[#00A651]' : isInvited ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                />
                {staff.status ? staff.status.charAt(0).toUpperCase() + staff.status.slice(1).toLowerCase() : 'Active'}
              </Badge>

              {staff.systemRole && (
                <Badge variant="secondary" className="text-[10.5px] font-mono uppercase tracking-wider font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-border/80">
                  {staff.systemRole.replace('_', ' ')}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{roleName}</span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-1.5">
                <DeptIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {staff.departmentObj?.name || staff.department}
              </span>
            </div>

            {/* Quick Staff ID Badge */}
            <div className="flex items-center gap-2 pt-0.5 text-xs text-muted-foreground">
              <span className="font-mono text-[11px] bg-muted/60 text-foreground px-2 py-0.5 rounded-md border border-border/60 font-medium">
                ID: {staff.employeeId || staff.id}
              </span>
            </div>
          </div>
        </div>

        {/* Status Meta */}
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/60 gap-1 text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Joined {formatDate(staff.createdAt || staff.dateJoined)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-[#00A651]" />
            <span>{staff.updatedAt ? `Updated ${formatDate(staff.updatedAt)}` : 'Last active · recent'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
