'use client';

import React from 'react';
import { ClipboardList, Check } from 'lucide-react';
import { StageFieldItem } from './stageFieldDefinitions';

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
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1 px-0.5 border-b border-border/40">
        <div className="flex items-center gap-1.5 min-w-0">
          <ClipboardList className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
            {step === 3 ? 'All Dossier Fields Checklist' : `Stage ${step + 1} Checklist`}
          </span>
        </div>
        <span
          className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
            stageDoneCount === stageTotalCount
              ? 'bg-emerald-500/15 text-[#008C44] dark:text-[#00C862] border-emerald-500/20'
              : 'bg-[#00A651]/10 text-[#008C44] dark:text-[#00C862] border-[#00A651]/20'
          }`}
        >
          {stageDoneCount}/{stageTotalCount} Done
        </span>
      </div>

      <div
        className={`space-y-1.5 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.3)_transparent] ${
          step === 3 ? 'max-h-[380px] sm:max-h-[440px]' : 'max-h-[300px]'
        }`}
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
            className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              field.isDone
                ? 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/15 dark:bg-emerald-950/20'
                : 'bg-card border-border/60 hover:bg-muted/40'
            }`}
            title={field.targetId ? `Click to jump to ${field.label}` : field.label}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center text-[8.5px] font-bold shrink-0 transition-colors ${
                  field.isDone
                    ? 'bg-[#00A651] text-white shadow-2xs ring-2 ring-[#00A651]/20'
                    : 'border border-border/80 bg-muted/30 text-transparent'
                }`}
              >
                {field.isDone ? <Check className="h-2.5 w-2.5" /> : null}
              </div>

              <span
                className={`text-xs truncate ${
                  field.isDone
                    ? 'text-slate-800 dark:text-slate-200 font-medium'
                    : 'text-slate-600 dark:text-slate-400 font-normal'
                }`}
              >
                {field.label}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {field.isDone ? (
                <span className="text-[9px] font-bold text-[#008C44] dark:text-[#00C862] flex items-center gap-0.5">
                  Filled
                </span>
              ) : (
                <span className="text-[9px] text-muted-foreground font-medium">
                  {field.isOptional ? 'Optional' : 'Fill →'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}