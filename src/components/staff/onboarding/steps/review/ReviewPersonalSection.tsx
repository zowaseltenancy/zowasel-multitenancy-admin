'use client';

import React from 'react';
import { User, Pencil } from 'lucide-react';
import { StaffFormValues } from '@/lib/validations/staff';

interface ReviewPersonalSectionProps {
  personalInfo?: StaffFormValues['personalInfo'];
  personalPhoneCode: string;
  onEdit: () => void;
}

export function ReviewPersonalSection({
  personalInfo,
  personalPhoneCode,
  onEdit,
}: ReviewPersonalSectionProps) {
  const formattedPhone = personalInfo?.phone
    ? personalInfo.phone.startsWith('+')
      ? personalInfo.phone
      : `${personalPhoneCode} ${personalInfo.phone}`
    : '—';

  return (
    <div id="rev-section-personal" className="p-3.5 space-y-2 scroll-mt-6">
      <div className="flex items-center justify-between pb-1 border-b border-border/40">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-[#00A651]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            1. Personal Identity & Demographics
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground block">First Name</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{personalInfo?.firstName || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Last Name</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{personalInfo?.lastName || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Work Email</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{personalInfo?.email || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Phone Number</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{formattedPhone}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Date of Birth</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{personalInfo?.dateOfBirth || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Gender</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{personalInfo?.gender || '—'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Nationality</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{personalInfo?.nationality || 'Nigerian'}</p>
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground block">Profile Photo</span>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {personalInfo?.avatarUrl ? 'Attached ✓' : 'Default Initials'}
          </p>
        </div>
      </div>
    </div>
  );
}
