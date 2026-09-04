'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ONBOARDING_STAGES } from './onboardingConstants';

interface OnboardingFooterNavProps {
  step: number;
  lastSavedTime: string;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function OnboardingFooterNav({
  step,
  lastSavedTime,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}: OnboardingFooterNavProps) {
  const router = useRouter();
  const isLastStage = step === ONBOARDING_STAGES.length - 1;

  return (
    <div className="p-3.5 sm:p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-3 shrink-0">
      {/* Left: Cancel */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.push('/admin/staff/directory')}
        className="h-10 text-xs sm:text-sm text-muted-foreground hover:text-foreground cursor-pointer px-4 rounded-xl"
      >
        Cancel
      </Button>

      {/* Center: Auto-Save Status */}
      <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-[#44883C] animate-pulse" />
        <span>Auto-saved at {lastSavedTime}</span>
      </div>

      {/* Right: Back & Continue */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={step === 0}
          className="h-10 text-xs sm:text-sm gap-1.5 font-medium cursor-pointer px-4 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        {isLastStage ? (
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-10 px-6 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold shadow-xs gap-2 cursor-pointer text-xs sm:text-sm rounded-xl"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Complete Onboarding
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={onNext}
            className="h-10 px-6 bg-[#44883C] hover:bg-[#3b7434] text-white font-bold shadow-xs gap-2 cursor-pointer text-xs sm:text-sm rounded-xl"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
