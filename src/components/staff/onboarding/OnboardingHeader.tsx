'use client';

import React from 'react';
import { CheckCircle2, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_STAGES } from './onboardingConstants';

interface OnboardingHeaderProps {
  step: number;
  completedDetailsCount: number;
  totalDetailsCount: number;
  onSaveDraft: () => void;
}

export function OnboardingHeader({
  step,
  completedDetailsCount,
  totalDetailsCount,
  onSaveDraft,
}: OnboardingHeaderProps) {
  const currentStage = ONBOARDING_STAGES[step];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
      <div className="space-y-0.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Onboard New Staff
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          {currentStage.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Stage Indicator Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A651]/10 border border-[#00A651]/25 text-[#008C44] dark:text-[#00C862]">
          <span className="text-xs font-bold uppercase tracking-wider">
            Stage {step + 1} of {ONBOARDING_STAGES.length}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">• {currentStage.estimate}</span>
        </div>

        {/* Completed Details Counter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/40 border border-border/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#00A651]" />
          <span>{completedDetailsCount}/{totalDetailsCount} Fields Done</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          className="h-8 gap-1.5 text-xs font-medium bg-card hover:bg-muted shadow-2xs rounded-xl"
        >
          <BookmarkCheck className="h-3.5 w-3.5 text-[#00A651]" /> Save as Draft
        </Button>
      </div>
    </div>
  );
}
