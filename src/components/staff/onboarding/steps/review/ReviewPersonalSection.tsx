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
    <div id="rev-section-personal" className="p-5 sm:p-6 space-y-3.5 scroll-mt-6">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            1. Personal Identity & Demographics
          </span>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 text-xs">
        <div>
          <span className="text-[11px] text-muted-foreground block">First Name</span>
          <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.firstName || '—'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Last Name</span>
          <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.lastName || '—'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Work Email</span>
          <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{personalInfo?.email || '—'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Phone Number</span>
          <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{formattedPhone}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Date of Birth</span>
          <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.dateOfBirth || '—'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Gender</span>
          <p className="font-semibold text-foreground capitalize text-[13px] mt-0.5">{personalInfo?.gender || '—'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Nationality</span>
          <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.nationality || 'Nigerian'}</p>
        </div>
        <div>
          <span className="text-[11px] text-muted-foreground block">Profile Photo</span>
          <p className="font-semibold text-foreground text-[13px] mt-0.5">
            {personalInfo?.avatarUrl ? 'Attached ✓' : 'Default Initials'}
          </p>
        </div>
      </div>
    </div>
  );
}
