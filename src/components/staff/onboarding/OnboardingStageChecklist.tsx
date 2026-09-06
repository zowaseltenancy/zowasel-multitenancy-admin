'use client';

import React from 'react';
import { ClipboardList, Check } from 'lucide-react';
import { StageFieldItem } from './stageFieldDefinitions';
import { getStageTheme } from './onboardingConstants';
import { cn } from '@/lib/utils';

interface OnboardingStageChecklistProps {
  step: number;
  currentStageFields: StageFieldItem[];
  stageDoneCount: number;
  stageTotalCount: number;
}

export function OnboardingStageChecklist({
  step,
  currentStageFields,
  stageDoneCount,
  stageTotalCount,
}: OnboardingStageChecklistProps) {
  const stageTheme = getStageTheme(step);

  return (
    <div className="space-y-2.5 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between pb-1.5 px-0.5 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <ClipboardList className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground truncate">
            {step === 3 ? 'All Dossier Fields Checklist' : `Stage ${step + 1} Checklist`}
          </span>
        </div>
        <span
          className={cn(
            'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 transition-colors duration-200',
            stageTheme.badgeBg,
            stageTheme.badgeBorder,
            stageTheme.badgeText
          )}
        >
          {stageDoneCount}/{stageTotalCount} Done
        </span>
      </div>

      <div
        className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {currentStageFields.map((field) => (
          <button
            key={field.id}
            type="button"
            onClick={() => {
              if (field.targetId) {
                const el = document.getElementById(field.targetId);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  el.focus();
                }
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              field.isDone
                ? 'bg-[#44883C]/5 border-[#44883C]/25 hover:bg-[#44883C]/10 dark:bg-[#44883C]/10'
                : 'bg-card border-border/60 hover:bg-muted/50'
            }`}
            title={field.targetId ? `Click to jump to ${field.label}` : field.label}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`text-xs truncate ${
                  field.isDone
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground font-normal'
                }`}
              >
                {field.label}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {field.isDone ? (
                <div className="h-4 w-4 rounded-full bg-[#44883C] text-white flex items-center justify-center shadow-2xs">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </div>
              ) : (
                <span className="text-[10px] text-muted-foreground font-medium px-1">
                  {field.isOptional ? 'Optional' : '○'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}