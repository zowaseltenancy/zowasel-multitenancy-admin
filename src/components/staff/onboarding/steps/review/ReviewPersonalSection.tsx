'use client';

import React from 'react';
import { User, Pencil, Check } from 'lucide-react';
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
    <div id="rev-section-personal" className="p-5 sm:p-6 space-y-4 scroll-mt-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            1. Personal Information & Identity
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

      {/* Main Content: Profile Picture on TOP LEFT, details to its right */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
        {/* Profile Picture at TOP LEFT */}
        <div className="shrink-0 flex flex-col items-center sm:items-start gap-1.5">
          <span className="text-[11px] text-muted-foreground block font-medium">Profile Headshot</span>
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-full overflow-hidden bg-muted border border-border/80 shadow-xs ring-2 ring-background flex items-center justify-center">
            {personalInfo?.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt="Candidate Headshot"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-muted-foreground/40" />
            )}
          </div>
          {personalInfo?.avatarUrl ? (
            <span className="text-[11px] font-bold text-[#44883C] dark:text-[#5cb850] flex items-center gap-1">
              <Check className="h-3 w-3 stroke-[3]" /> Uploaded
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">Not attached</span>
          )}
        </div>

        {/* Input Data Fields */}
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 text-xs w-full">
          <div>
            <span className="text-[11px] text-muted-foreground block">First Name</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.firstName || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Last Name</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{personalInfo?.lastName || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Official Work Email</span>
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
        </div>
      </div>
    </div>
  );
}
