'use client';

import React from 'react';
import { Check, BookmarkCheck, ShieldCheck, Milestone } from 'lucide-react';
import { ONBOARDING_STAGES, STAGE_GUIDELINES } from './onboardingConstants';
import { CandidateSummaryCard } from './CandidateSummaryCard';

interface OnboardingRightRailProps {
  step: number;
  avatarUrl?: string;
  candidateInitials?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateRole?: string;
  candidateDept?: string;
  stageDoneCount?: number;
  stageTotalCount?: number;
  completedDetailsCount?: number;
  totalDetailsCount?: number;
  onGoToStep?: (step: number) => void;
}

export function OnboardingRightRail({
  step,
  avatarUrl,
  candidateInitials = 'ZS',
  candidateName = 'New Staff Candidate',
  candidateEmail,
  candidateRole,
  candidateDept,
  onGoToStep,
}: OnboardingRightRailProps) {
  const stagePercentage = Math.round(((step + 1) / ONBOARDING_STAGES.length) * 100);

  return (
    <div className="rounded-2xl border border-border/70 bg-card shadow-xs p-3.5 sm:p-4 flex flex-col justify-between space-y-3.5 overflow-hidden w-full h-full">
      <div className="space-y-3.5 flex-1 flex flex-col min-h-0">
        {/* 1. CANDIDATE PROFILE PICTURE & IDENTITY CARD */}
        <CandidateSummaryCard
          avatarUrl={avatarUrl}
          candidateInitials={candidateInitials}
          candidateName={candidateName}
          candidateEmail={candidateEmail}
          candidateRole={candidateRole}
          candidateDept={candidateDept}
          step={step}
        />

        {/* 2. ONBOARDING STAGES ROADMAP */}
        <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between px-1 pb-1">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-foreground">
              Stages Progress
            </span>
            <span className="text-[10px] font-mono font-bold text-[#44883C]">
              {stagePercentage}%
            </span>
          </div>

          <div className="space-y-1.5">
            {ONBOARDING_STAGES.map((s, index) => {
              const isCompleted = s.id < step;
              const isCurrent = s.id === step;

              if (isCompleted) {
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onGoToStep?.(s.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#44883C]/5 border border-[#44883C]/25 hover:bg-[#44883C]/10 transition-all text-left cursor-pointer group shadow-2xs"
                    title={`Click to review or edit ${s.title}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-4 w-4 rounded-full bg-[#44883C] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold text-foreground truncate">
                        {s.shortLabel}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-[#44883C] dark:text-[#5cb850] font-bold group-hover:underline shrink-0">
                      Done ✓
                    </span>
                  </button>
                );
              }

              if (isCurrent) {
                return (
                  <div
                    key={s.id}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#44883C]/10 border border-[#44883C] shadow-xs text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-4 w-4 rounded-full bg-[#44883C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-xs font-bold text-foreground truncate">
                        {s.shortLabel}
                      </span>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#44883C] animate-pulse shrink-0" />
                  </div>
                );
              }

              return (
                <div
                  key={s.id}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-card border border-border/50 text-left opacity-70"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-4 w-4 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-medium shrink-0 border border-border/40">
                      {index + 1}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {s.shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. CONTEXTUAL STAGE GUIDELINE */}
        <div className="p-2.5 rounded-xl bg-muted/25 border border-border/60 space-y-1 text-xs text-muted-foreground shadow-2xs shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[10.5px]">
            <BookmarkCheck className="h-3.5 w-3.5 text-[#44883C]" />
            <span>Stage Guidance</span>
          </div>
          <p className="text-[10.5px] leading-relaxed text-muted-foreground">
            {STAGE_GUIDELINES[step] || 'Complete the required fields above to proceed to the next stage.'}
          </p>
        </div>
      </div>

      {/* 4. COMPLIANCE FOOTER */}
      <div className="pt-2 border-t border-border/50 flex items-center gap-1.5 text-[10px] text-muted-foreground shrink-0">
        <ShieldCheck className="h-3.5 w-3.5 text-[#44883C] shrink-0" />
        <span>Statutory enterprise records are encrypted & auto-saved.</span>
      </div>
    </div>
  );
}
