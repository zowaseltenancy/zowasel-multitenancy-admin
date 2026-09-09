'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  KeyRound, MoreHorizontal, ShieldCheck, Building2,
  CalendarPlus, Mail, UserX, UserCheck, ChevronRight,
} from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface ProfileHeaderProps {
  staff: StaffMember;
  onEditProfile?: () => void;
  onResetPassword: () => void;
  onChangeRole?: () => void;
  onReassignDept: () => void;
  onRequestLeave?: () => void;
  onSendMessage: () => void;
  onToggleStatus: () => void;
}

export function ProfileHeader({
  staff,
  onResetPassword,
  onChangeRole,
  onReassignDept,
  onRequestLeave,
  onSendMessage,
  onToggleStatus,
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-3 pb-2 border-b border-border/60">
      {/* Breadcrumbs: Staff Management → All Staff → Staff Profile */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <button
          type="button"
          onClick={() => router.push('/admin/staff/directory')}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          Staff Management
        </button>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <button
          type="button"
          onClick={() => router.push('/admin/staff/directory')}
          className="hover:text-foreground transition-colors cursor-pointer"
        >
          All Staff
        </button>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <span className="text-foreground font-semibold">Staff Profile</span>
      </nav>

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Staff Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View and manage staff member information and details.
          </p>
        </div>

        {/* Right Actions: Reset Password, More Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetPassword}
            className="h-8 sm:h-9 px-3 text-xs sm:text-sm font-medium gap-1.5 cursor-pointer"
          >
            <KeyRound className="h-3.5 w-3.5" /> Reset Password
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card h-8 sm:h-9 w-8 sm:w-9 p-0 text-xs font-medium cursor-pointer hover:bg-muted/50 hover:text-foreground shadow-2xs"
              title="More Actions"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More Actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Staff Actions
              </DropdownMenuLabel>
              {onChangeRole && (
                <DropdownMenuItem onClick={onChangeRole} className="gap-2 cursor-pointer text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> Change Role
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onReassignDept} className="gap-2 cursor-pointer text-xs">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Reassign Department
              </DropdownMenuItem>
              {onRequestLeave && (
                <DropdownMenuItem onClick={onRequestLeave} className="gap-2 cursor-pointer text-xs">
                  <CalendarPlus className="h-3.5 w-3.5 text-muted-foreground" /> Request Leave
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onSendMessage} className="gap-2 cursor-pointer text-xs">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Send Message
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onToggleStatus}
                className={`gap-2 cursor-pointer text-xs ${
                  staff.status === 'active' ? 'text-amber-600 dark:text-amber-400' : 'text-[#00A651]'
                }`}
              >
                {staff.status === 'active' ? (
                  <>
                    <UserX className="h-3.5 w-3.5" /> Deactivate Staff
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" /> Activate Staff
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
