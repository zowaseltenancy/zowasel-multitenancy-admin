'use client';

import React from 'react';
import { getStageTheme } from './onboardingConstants';
import { cn } from '@/lib/utils';

interface CandidateSummaryCardProps {
  avatarUrl?: string;
  candidateInitials: string;
  candidateName: string;
  candidateEmail?: string;
  candidateRole?: string;
  candidateDept?: string;
  step?: number;
}

export function CandidateSummaryCard({
  avatarUrl,
  candidateInitials,
  candidateName,
  candidateEmail,
  candidateRole,
  candidateDept,
  step = 0,
}: CandidateSummaryCardProps) {
  const stageTheme = getStageTheme(step);

  return (
    <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-2xs shrink-0">
      {/* Subtle top stage accent line */}
      <div className={cn('h-1 w-full bg-gradient-to-r transition-all duration-300', stageTheme.topBarGradient)} />

      <div
        className={cn(
          'relative w-full h-32 sm:h-36 flex items-center justify-center overflow-hidden border-b border-border/50 p-2.5 bg-gradient-to-b transition-all duration-300',
          stageTheme.ambientGradient,
          'bg-muted/15'
        )}
      >
        {avatarUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient soft blurred backdrop to seamlessly blend aspect ratios */}
            <img
              src={avatarUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
            />
            {/* Primary profile picture displayed clearly */}
            <img
              src={avatarUrl}
              alt="Candidate Avatar"
              className="relative max-h-full max-w-full rounded-xl object-contain shadow-xs z-10"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 p-2.5 text-center w-full h-full">
            <div className="h-16 w-16 rounded-full bg-card border-2 border-dashed border-border/80 flex items-center justify-center text-lg font-bold text-foreground shadow-xs">
              {candidateInitials}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground block">No photo uploaded</span>
              <span className="text-[11px] text-muted-foreground block">Attach headshot in Stage 1</span>
            </div>
          </div>
        )}
        <span
          className={`absolute top-2.5 right-2.5 h-3 w-3 rounded-full border-2 border-card shadow-xs z-20 ${
            avatarUrl ? 'bg-[#44883C] ring-2 ring-[#44883C]/20' : 'bg-amber-500 ring-2 ring-amber-500/20'
          }`}
          title={avatarUrl ? 'Photo Uploaded' : 'Photo Pending'}
        />
      </div>

      <div className="py-2.5 px-3 text-center space-y-1 bg-card">
        <p className="font-bold text-sm text-foreground truncate">{candidateName}</p>
        <p className="text-xs text-muted-foreground font-mono truncate leading-tight">
          {candidateEmail || 'email@pending.com'}
        </p>
        {(candidateRole || candidateDept) && (
          <div className="pt-0.5 flex items-center justify-center gap-1">
            <span className="text-[10px] font-medium bg-[#44883C]/10 text-[#44883C] dark:text-[#5cb850] px-2 py-0.5 rounded-full border border-[#44883C]/20 truncate max-w-[200px]">
              {[candidateRole, candidateDept].filter(Boolean).join(' • ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
