'use client';

import React from 'react';
import { BookmarkCheck } from 'lucide-react';
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
  currentStageFields: StageFieldItem[];
  stageDoneCount: number;
  stageTotalCount: number;
  completedDetailsCount: number;
  totalDetailsCount: number;
}

export function OnboardingRightRail({
  step,
  avatarUrl,
  candidateInitials,
  candidateName,
  candidateEmail,
  currentStageFields,
  stageDoneCount,
  stageTotalCount,
  completedDetailsCount,
  totalDetailsCount,
}: OnboardingRightRailProps) {
  return (
    <div className="lg:col-span-3 p-4 sm:p-5 bg-muted/15 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <CandidateSummaryCard
          avatarUrl={avatarUrl}
          candidateInitials={candidateInitials}
          candidateName={candidateName}
          candidateEmail={candidateEmail}
        />

        {/* CURRENT STAGE FIELD CHECKLIST */}
        <OnboardingStageChecklist
          step={step}
          currentStageFields={currentStageFields}
          stageDoneCount={stageDoneCount}
          stageTotalCount={stageTotalCount}
        />

        {/* Contextual Stage Guideline Note */}
        <div className="p-3 rounded-xl bg-card border border-border/50 space-y-1 text-xs text-muted-foreground shadow-2xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
            <BookmarkCheck className="h-3.5 w-3.5 text-[#00A651]" />
            <span>Stage Note</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {STAGE_GUIDELINES[step] || 'Complete the required fields above to proceed to the next onboarding stage.'}
          </p>
        </div>
      </div>

      {/* BOTTOM: Stage Progress Meter */}
      <div className="pt-3 border-t border-border/50 space-y-2 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10.5px] font-medium text-slate-600 dark:text-slate-400">
            <span>Stage Completion:</span>
            <span className="font-bold text-[#008C44] dark:text-[#00C862]">
              {stageDoneCount}/{stageTotalCount} Fields
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00A651] via-teal-500 to-[#00A651] transition-all duration-300 rounded-full"
              style={{ width: `${stageTotalCount > 0 ? (stageDoneCount / stageTotalCount) * 100 : 100}%` }}
            />
          </div>
        </div>

        <div className="pt-0.5 text-[10px] text-muted-foreground flex items-center justify-between border-t border-border/40">
          <span>Overall Stage {step + 1} of {ONBOARDING_STAGES.length}</span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {completedDetailsCount}/{totalDetailsCount} Completed
          </span>
        </div>
      </div>
    </div>
  );
}
