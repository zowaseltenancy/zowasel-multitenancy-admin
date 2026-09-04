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
    <div className="p-3.5 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-muted text-foreground font-bold text-base flex items-center justify-center border shrink-0 overflow-hidden shadow-xs">
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
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{candidateName}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {candidateRole} • {candidateDept}
          </p>
          <p className="text-[10.5px] font-mono text-muted-foreground">
            {candidateEmail || '—'}
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#00A651]/15 text-[#008C44] dark:text-[#00C862] border border-[#00A651]/30 self-start sm:self-auto">
        <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Provisioning
      </span>
    </div>
  );
}
