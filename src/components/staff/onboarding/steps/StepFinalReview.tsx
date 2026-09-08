'use client';

import React from 'react';
import { StaffFormValues } from '@/lib/validations/staff';
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
  candidateRole,
  candidateDept,
  personalPhoneCode,
  kinPhoneCode,
  onGoToStep,
}: StepFinalReviewProps) {
  return (
    <div className="border border-border/60 rounded-xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      {/* 1. Personal Information & Identity */}
      <ReviewPersonalSection
        personalInfo={currentValues.personalInfo}
        personalPhoneCode={personalPhoneCode}
        onEdit={() => onGoToStep(0)}
      />

      {/* 2. Permanent Address & Next of Kin */}
      <ReviewAddressKinSection
        address={currentValues.address}
        nextOfKin={currentValues.nextOfKin}
        kinPhoneCode={kinPhoneCode}
        onEdit={() => onGoToStep(1)}
      />

      {/* 3. Corporate Placement & Payroll */}
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
