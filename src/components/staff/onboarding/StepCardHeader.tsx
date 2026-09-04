'use client';

import React from 'react';

interface StepCardHeaderProps {
  stepNumber: number;
  title: string;
  description: string;
}

export function StepCardHeader({ stepNumber, title, description }: StepCardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-md bg-[#44883C]/10 text-[#44883C] flex items-center justify-center font-bold text-xs">
            {stepNumber}
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
