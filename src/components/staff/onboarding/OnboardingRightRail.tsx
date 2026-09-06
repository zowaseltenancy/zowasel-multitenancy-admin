'use client';

import React from 'react';
import { BookmarkCheck, Check } from 'lucide-react';
import { ONBOARDING_STAGES, STAGE_GUIDELINES } from './onboardingConstants';
import { StageFieldItem } from './stageFieldDefinitions';
import { CandidateSummaryCard } from './CandidateSummaryCard';
import { OnboardingStageChecklist } from './OnboardingStageChecklist';

interface OnboardingRightRailProps {
  step: number;
  avatarUrl?: string;
  candidateInitials: string;
  candidateName: string;
  candidateEmail?: string;
  candidateRole?: string;
  candidateDept?: string;
  currentStageFields: StageFieldItem[];
  stageDoneCount: number;
  stageTotalCount: number;
  completedDetailsCount: number;
  totalDetailsCount: number;
  onGoToStep?: (step: number) => void;
}

export function OnboardingRightRail({
  step,
  avatarUrl,
  candidateInitials,
  candidateName,
  candidateEmail,
  candidateRole,
  candidateDept,
  currentStageFields,
  stageDoneCount,
  stageTotalCount,
  completedDetailsCount,
  totalDetailsCount,
  onGoToStep,
}: OnboardingRightRailProps) {
  // Dynamic percentage calculation based on overall stages and field completion
  const progressPercentage = Math.min(
    100,
    Math.round((completedDetailsCount / Math.max(totalDetailsCount, 1)) * 100)
  );

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-xs p-4 sm:p-5 flex flex-col justify-between space-y-4 overflow-hidden w-full h-full">
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* 1. CANDIDATE PROFILE CARD WITH PHOTO */}
        <CandidateSummaryCard
          avatarUrl={avatarUrl}
          candidateInitials={candidateInitials}
          candidateName={candidateName}
          candidateEmail={candidateEmail}
          candidateRole={candidateRole}
          candidateDept={candidateDept}
          step={step}
        />

        {/* 2. VERTICAL ROADMAP & SCROLLED-UP COMPLETED STAGES */}
        <div className="space-y-2 pt-1 shrink-0">
          {/* If there are completed previous stages, show them scrolled up/collapsed */}
          {step > 0 && step < 3 && (
            <div className="space-y-1.5 pb-2 border-b border-border/50">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                Completed Stages
              </span>
              {ONBOARDING_STAGES.filter((s) => s.id < step).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onGoToStep?.(s.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#44883C]/10 border border-[#44883C]/20 hover:bg-[#44883C]/15 transition-all text-left cursor-pointer group shadow-2xs"
                  title={`Click to review or edit ${s.title}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-4 w-4 rounded-full bg-[#44883C] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-foreground truncate">
                      {s.shortLabel} Details
                    </span>
                  </div>
                  <span className="text-[10.5px] text-[#44883C] dark:text-[#5cb850] font-bold group-hover:underline shrink-0">
                    Done ✓
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Current Stage Indicator Header */}
          <div className="flex items-center justify-between px-1 pb-0.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-foreground">
              {step === 3 ? 'All Revealed Form Fields' : `Stage ${step + 1} Form Fields`}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {step === 3 ? '26 Fields' : 'Live Status'}
            </span>
          </div>
        </div>

        {/* 4. CURRENT STAGE / ALL REVEALED FORM FIELDS CHECKLIST */}
        <OnboardingStageChecklist
          step={step}
          currentStageFields={currentStageFields}
          stageDoneCount={stageDoneCount}
          stageTotalCount={stageTotalCount}
        />

        {/* 5. Contextual Stage Note */}
        <div className="p-2.5 rounded-xl bg-card border border-border/60 space-y-1 text-xs text-muted-foreground shadow-2xs shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
            <BookmarkCheck className="h-3.5 w-3.5 text-[#44883C]" />
            <span>Stage Note</span>
          </div>
          <p className="text-[10.5px] leading-relaxed text-muted-foreground">
            {STAGE_GUIDELINES[step] || 'Complete the required fields above to proceed to the next onboarding stage.'}
          </p>
        </div>
      </div>

      {/* BOTTOM: Stage Progress Meter */}
      <div className="pt-3 border-t border-border/50 space-y-2 shrink-0">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-foreground">
            <span>Stage Completion:</span>
            <span className="font-bold text-[#44883C] dark:text-[#5cb850]">
              {stageDoneCount}/{stageTotalCount} Fields
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#44883C] transition-all duration-300 rounded-full"
              style={{ width: `${stageTotalCount > 0 ? (stageDoneCount / stageTotalCount) * 100 : 100}%` }}
            />
          </div>
        </div>

        <div className="pt-1 text-[10.5px] text-muted-foreground flex items-center justify-between border-t border-border/40">
          <span>Overall Stage {step + 1} of {ONBOARDING_STAGES.length}</span>
          <span className="font-semibold text-foreground">
            {completedDetailsCount}/{totalDetailsCount} Completed
          </span>
        </div>
      </div>
    </div>
  );
}
