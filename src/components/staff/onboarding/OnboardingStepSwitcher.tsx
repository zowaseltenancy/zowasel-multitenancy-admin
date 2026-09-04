'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { StaffFormValues } from '@/lib/validations/staff';
import { StepPersonalInfo } from './steps/StepPersonalInfo';
import { StepAddressAndKin } from './steps/StepAddressAndKin';
import { StepPlacementPayroll } from './steps/StepPlacementPayroll';
import { StepFinalReview } from './steps/StepFinalReview';

interface OnboardingStepSwitcherProps {
  step: number;
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  watch: UseFormWatch<StaffFormValues>;
  setValue: UseFormSetValue<StaffFormValues>;
  currentValues: StaffFormValues;
  departments: string[];
  roles: { id: string; name: string }[];
  personalPhoneCode: string;
  setPersonalPhoneCode: (code: string) => void;
  kinPhoneCode: string;
  setKinPhoneCode: (code: string) => void;
  candidateName: string;
  candidateInitials: string;
  candidateRole: string;
  candidateDept: string;
  onOpenCamera: () => void;
  onGoToStep: (step: number) => void;
}

export function OnboardingStepSwitcher({
  step,
  register,
  errors,
  watch,
  setValue,
  currentValues,
  departments,
  roles,
  personalPhoneCode,
  setPersonalPhoneCode,
  kinPhoneCode,
  setKinPhoneCode,
  candidateName,
  candidateInitials,
  candidateRole,
  candidateDept,
  onOpenCamera,
  onGoToStep,
}: OnboardingStepSwitcherProps) {
  if (step === 0) {
    return (
      <StepPersonalInfo
        register={register}
        errors={errors}
        avatarUrl={currentValues.personalInfo?.avatarUrl}
        onAvatarChange={(url) => setValue('personalInfo.avatarUrl', url, { shouldValidate: true })}
        onOpenCamera={onOpenCamera}
        personalPhoneCode={personalPhoneCode}
        setPersonalPhoneCode={setPersonalPhoneCode}
        gender={currentValues.personalInfo?.gender}
        onGenderChange={(g) => setValue('personalInfo.gender', g as any, { shouldValidate: true, shouldDirty: true })}
      />
    );
  }

  if (step === 1) {
    return (
      <StepAddressAndKin
        register={register}
        errors={errors}
        kinPhoneCode={kinPhoneCode}
        setKinPhoneCode={setKinPhoneCode}
      />
    );
  }

  if (step === 2) {
    return (
      <StepPlacementPayroll
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        departments={departments}
        roles={roles}
      />
    );
  }

  return (
    <StepFinalReview
      currentValues={currentValues}
      candidateName={candidateName}
      candidateInitials={candidateInitials}
      candidateRole={candidateRole}
      candidateDept={candidateDept}
      personalPhoneCode={personalPhoneCode}
      kinPhoneCode={kinPhoneCode}
      onGoToStep={onGoToStep}
    />
  );
}
