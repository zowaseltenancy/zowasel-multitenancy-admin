'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ReviewOverviewBannerProps {
  avatarUrl?: string;
  candidateInitials: string;
  candidateName: string;
  candidateRole: string;
  candidateDept: string;
  candidateEmail?: string;
}

export function ReviewOverviewBanner({
  avatarUrl,
  candidateInitials,
  candidateName,
  candidateRole,
  candidateDept,
  candidateEmail,
}: ReviewOverviewBannerProps) {
  return (
    <div className="p-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60">
      <div className="flex items-center gap-3.5">
        <div className="h-14 w-14 rounded-xl bg-muted text-foreground font-bold text-lg flex items-center justify-center border shrink-0 overflow-hidden shadow-xs">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            candidateInitials
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">{candidateName}</h3>
          <p className="text-xs text-muted-foreground font-medium">
            {candidateRole} • {candidateDept}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground">
            {candidateEmail || '—'}
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#44883C]/10 text-[#44883C] dark:text-[#5cb850] border border-[#44883C]/25 self-start sm:self-auto shadow-2xs">
        <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Provisioning
      </span>
    </div>
  );
}
