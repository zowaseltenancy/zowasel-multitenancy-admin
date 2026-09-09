'use client';

import React from 'react';
import { getStageTheme } from './onboardingConstants';
import { cn } from '@/lib/utils';

interface StepCardHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function StepCardHeader({ stepNumber, title, description }: StepCardHeaderProps) {
  const stageTheme = getStageTheme(stepNumber - 1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'h-6 w-6 rounded-lg border flex items-center justify-center font-bold text-xs shadow-2xs transition-colors duration-200',
              stageTheme.stepNumberBg,
              stageTheme.stepNumberBorder,
              stageTheme.stepNumberText
            )}
          >
            {stepNumber}
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
