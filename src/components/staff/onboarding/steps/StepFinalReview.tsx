'use client';

import React from 'react';
import { StaffFormValues } from '@/lib/validations/staff';
import { ReviewOverviewBanner } from './review/ReviewOverviewBanner';
import { ReviewPersonalSection } from './review/ReviewPersonalSection';
import { ReviewAddressKinSection } from './review/ReviewAddressKinSection';
import { ReviewPlacementPayrollSection } from './review/ReviewPlacementPayrollSection';

interface StepFinalReviewProps {
  currentValues: StaffFormValues;
  candidateName: string;
  candidateInitials: string;
  candidateRole: string;
  candidateDept: string;
  personalPhoneCode: string;
  kinPhoneCode: string;
  onGoToStep: (step: number) => void;
}

export function StepFinalReview({
  currentValues,
  candidateName,
  candidateInitials,
  candidateRole,
  candidateDept,
  personalPhoneCode,
  kinPhoneCode,
  onGoToStep,
}: StepFinalReviewProps) {
  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      <ReviewOverviewBanner
        avatarUrl={currentValues.personalInfo?.avatarUrl}
        candidateInitials={candidateInitials}
        candidateName={candidateName}
        candidateRole={candidateRole}
        candidateDept={candidateDept}
        candidateEmail={currentValues.personalInfo?.email}
      />

      <ReviewPersonalSection
        personalInfo={currentValues.personalInfo}
        personalPhoneCode={personalPhoneCode}
        onEdit={() => onGoToStep(0)}
      />

      <ReviewAddressKinSection
        address={currentValues.address}
        nextOfKin={currentValues.nextOfKin}
        kinPhoneCode={kinPhoneCode}
        onEdit={() => onGoToStep(1)}
      />

      <ReviewPlacementPayrollSection
        employment={currentValues.employment}
        bank={currentValues.bank}
        candidateDept={candidateDept}
        candidateRole={candidateRole}
        onEdit={() => onGoToStep(2)}
      />
    </div>
  );
}
