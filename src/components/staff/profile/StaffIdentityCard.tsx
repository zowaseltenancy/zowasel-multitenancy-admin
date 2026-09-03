'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, Phone, MapPin, CalendarDays, Clock, Copy, Check } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { toast } from 'sonner';

interface StaffIdentityCardProps {
  staff: StaffMember;
  roleName: string;
  onEditPhoto: () => void;
}

export function StaffIdentityCard({ staff, roleName, onEditPhoto }: StaffIdentityCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const initials = `${staff.firstName?.[0] || ''}${staff.lastName?.[0] || ''}`.toUpperCase() || 'ZS';
  const DeptIcon = getDepartmentIcon(staff.department);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  return (
    <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        
        {/* Left: Avatar & Identity details */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          {/* Avatar with Camera/Edit trigger */}
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

            {/* Camera / Edit Photo control */}
            <button
              type="button"
              onClick={onEditPhoto}
              aria-label="Update staff photo"
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-xl bg-card border border-border shadow-xs flex items-center justify-center text-muted-foreground hover:text-[#00A651] hover:border-[#00A651]/50 transition-all cursor-pointer"
              title="Update photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Core Info Hierarchy */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {staff.firstName} {staff.lastName}
              </h2>

              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`text-[11px] font-semibold px-2 py-0.5 ${
                  staff.status === 'active'
                    ? 'text-[#008C44] dark:text-[#00C862] border-[#00A651]/30 bg-[#00A651]/10'
                    : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                    staff.status === 'active' ? 'bg-[#00A651]' : 'bg-amber-500'
                  }`}
                />
                {staff.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Job Title & Department */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{roleName}</span>
              <span className="text-muted-foreground">•</span>
              <span className="inline-flex items-center gap-1.5">
                <DeptIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {staff.department}
              </span>
            </div>

            {/* Metadata (quieter): Staff ID, Email, Phone */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground pt-0.5">
              {staff.employeeId && (
                <button
                  type="button"
                  onClick={() => handleCopy(staff.employeeId!, 'Staff ID')}
                  className="inline-flex items-center gap-1 font-mono text-[11px] hover:text-foreground transition-colors cursor-pointer"
                  title="Click to copy Staff ID"
                >
                  <span className="text-[10px] text-muted-foreground/80 font-sans">ID:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.employeeId}</span>
                  {copiedField === 'Staff ID' ? (
                    <Check className="h-3 w-3 text-[#00A651]" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-50" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => handleCopy(staff.email, 'Email')}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
              >
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{staff.email}</span>
                {copiedField === 'Email' && <Check className="h-3 w-3 text-[#00A651]" />}
              </button>

              {staff.phone && (
                <a
                  href={`tel:${staff.phone}`}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{staff.phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right / Secondary Status: Date Joined & Last Active */}
        <div className="flex flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border/60 gap-1 text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Joined {formatDate(staff.dateJoined)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5 text-[#00A651]" />
            <span>Last active · 12 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
