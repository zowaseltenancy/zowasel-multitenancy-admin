'use client';

import React from 'react';

interface CandidateSummaryCardProps {
  avatarUrl?: string;
  candidateInitials: string;
  candidateName: string;
  candidateEmail?: string;
}

export function CandidateSummaryCard({
  avatarUrl,
  candidateInitials,
  candidateName,
  candidateEmail,
}: CandidateSummaryCardProps) {
  return (
    <div className="rounded-2xl bg-card border border-border/60 overflow-hidden shadow-2xs shrink-0">
      <div className="relative w-full aspect-[4/3] sm:h-40 md:h-44 bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/50 p-2">
        {avatarUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Ambient soft blurred backdrop to seamlessly blend aspect ratios */}
            <img
              src={avatarUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-md opacity-25 scale-110 pointer-events-none"
            />
            {/* Primary uncropped profile picture displayed completely */}
            <img
              src={avatarUrl}
              alt="Candidate Avatar"
              className="relative max-h-full max-w-full rounded-xl object-contain shadow-xs z-10"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-2 p-3 text-center w-full h-full">
            <div className="h-14 w-14 rounded-full bg-card border-2 border-dashed border-border/80 flex items-center justify-center text-base font-bold text-foreground shadow-xs">
              {candidateInitials}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">No photo uploaded</span>
              <span className="text-[10px] text-muted-foreground block">Attach headshot in Stage 1</span>
            </div>
          </div>
        )}
        <span
          className={`absolute top-3 right-3 h-3 w-3 rounded-full border-2 border-card shadow-xs z-20 ${
            avatarUrl ? 'bg-[#44883C]' : 'bg-amber-400'
          }`}
          title={avatarUrl ? 'Photo Uploaded' : 'Photo Pending'}
        />
      </div>

      <div className="py-2.5 px-3 text-center space-y-0.5 bg-card">
        <p className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{candidateName}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate leading-tight">
          {candidateEmail || 'email@pending.com'}
        </p>
      </div>
    </div>
  );
}
