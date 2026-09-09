'use client';

import React from 'react';
import { CheckCircle2, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_STAGES, getStageTheme } from './onboardingConstants';
import { cn } from '@/lib/utils';

interface OnboardingHeaderProps {
  title?: string;
  step: number;
  completedDetailsCount: number;
  totalDetailsCount: number;
  onSaveDraft: () => void;
}

export function OnboardingHeader({
  title,
  step,
  completedDetailsCount,
  totalDetailsCount,
  onSaveDraft,
}: OnboardingHeaderProps) {
  const currentStage = ONBOARDING_STAGES[step];
  const stageTheme = getStageTheme(step);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title || 'Onboard New Staff'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {currentStage.description}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Stage Indicator Badge */}
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs transition-colors duration-200',
            stageTheme.badgeBg,
            stageTheme.badgeBorder,
            stageTheme.badgeText
          )}
        >
          <span className={cn('h-2 w-2 rounded-full animate-pulse', stageTheme.badgeDot)} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Stage {step + 1} of {ONBOARDING_STAGES.length}
          </span>
          <span className="text-xs opacity-75 font-medium">• {currentStage.estimate}</span>
        </div>

        {/* Completed Details Counter Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/60 text-xs font-semibold text-foreground shadow-2xs">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#44883C]" />
          <span>{completedDetailsCount}/{totalDetailsCount} Fields Done</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          className="h-8 gap-1.5 text-xs font-medium bg-background hover:bg-muted/80 shadow-2xs rounded-xl border-border/70 transition-all active:scale-[0.98]"
        >
          <BookmarkCheck className="h-3.5 w-3.5 text-[#44883C]" /> Save as Draft
        </Button>
      </div>
    </div>
  );
}
