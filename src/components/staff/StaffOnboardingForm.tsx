'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { StaffFormValues } from '@/lib/validations/staff';
import { OnboardingHeader } from './onboarding/OnboardingHeader';
import { StepCardHeader } from './onboarding/StepCardHeader';
import { OnboardingStepSwitcher } from './onboarding/OnboardingStepSwitcher';
import { OnboardingRightRail } from './onboarding/OnboardingRightRail';
import { OnboardingFooterNav } from './onboarding/OnboardingFooterNav';
import { OnboardingCameraModal } from './onboarding/OnboardingCameraModal';
import { useStaffOnboardingForm } from './onboarding/useStaffOnboardingForm';

interface StaffOnboardingFormProps {
  initialStep?: number;
  title?: string;
  defaultValues?: Partial<StaffFormValues>;
  roles: { id: string; name: string }[];
  departments: string[];
  onSubmit: (data: StaffFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export function StaffOnboardingForm({
  initialStep = 0,
  title,
  defaultValues,
  roles,
  departments,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}: StaffOnboardingFormProps) {
  const {
    step,
    currentStage,
    cameraModalOpen,
    setCameraModalOpen,
    lastSavedTime,
    webcamRef,
    formScrollRef,
    register,
    handleSubmit,
    watch,
    setValue,
    errors,
    currentValues,
    personalPhoneCode,
    setPersonalPhoneCode,
    kinPhoneCode,
    setKinPhoneCode,
    goToStep,
    capturePhoto,
    onFinalSubmit,
    currentStageFields,
    stageDoneCount,
    stageTotalCount,
    completedDetailsCount,
    totalDetailsCount,
    candidateName,
    candidateInitials,
    candidateRole,
    candidateDept,
  } = useStaffOnboardingForm({ initialStep, defaultValues, roles, onSubmit });

  return (
    <div className="space-y-3.5 w-full max-w-7xl mx-auto">
      <OnboardingHeader
        title={title}
        step={step}
        completedDetailsCount={completedDetailsCount}
        totalDetailsCount={totalDetailsCount}
        onSaveDraft={() => toast.success('Draft progress saved successfully. You can safely resume later.')}
      />

      {/* DUAL-PANE DESKTOP LAYOUT: Form content scrolls internally; Side wizard remains completely fixed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start lg:h-[calc(100vh-12.5rem)] lg:min-h-[580px]">
        {/* LEFT: MAIN FORM CARD (Center content that scrolls internally) */}
        <div
          className="lg:col-span-9 rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden flex flex-col h-full"
        >
          <div
            ref={formScrollRef}
            className="p-6 sm:p-8 lg:p-9 space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200 flex-1 overflow-y-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="space-y-6 sm:space-y-8">
              <StepCardHeader
                stepNumber={step + 1}
                title={currentStage.title}
                description={currentStage.description}
              />

              <OnboardingStepSwitcher
                step={step}
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                currentValues={currentValues}
                departments={departments}
                roles={roles}
                personalPhoneCode={personalPhoneCode}
                setPersonalPhoneCode={setPersonalPhoneCode}
                kinPhoneCode={kinPhoneCode}
                setKinPhoneCode={setKinPhoneCode}
                candidateName={candidateName}
                candidateInitials={candidateInitials}
                candidateRole={candidateRole}
                candidateDept={candidateDept}
                onOpenCamera={() => setCameraModalOpen(true)}
                onGoToStep={goToStep}
              />
            </div>

            <div className="pt-5 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-[#44883C] shrink-0" />
              <span>All entered data is securely encrypted and auto-saved in compliance with enterprise policies.</span>
            </div>
          </div>

          <OnboardingFooterNav
            step={step}
            lastSavedTime={lastSavedTime}
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            onCancel={onCancel}
            onBack={() => {
              if (step > 0) goToStep(step - 1);
            }}
            onNext={() => goToStep(step + 1)}
            onSubmit={handleSubmit(onFinalSubmit)}
          />
        </div>

        {/* RIGHT: WIZARD PROGRESS CARD (Completely static and fixed in place, does NOT move) */}
        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
          <OnboardingRightRail
            step={step}
            avatarUrl={currentValues.personalInfo?.avatarUrl}
            candidateInitials={candidateInitials}
            candidateName={candidateName}
            candidateEmail={currentValues.personalInfo?.email}
            candidateRole={candidateRole}
            candidateDept={candidateDept}
            currentStageFields={currentStageFields}
            stageDoneCount={stageDoneCount}
            stageTotalCount={stageTotalCount}
            completedDetailsCount={completedDetailsCount}
            totalDetailsCount={totalDetailsCount}
            onGoToStep={goToStep}
          />
        </div>
      </div>

      <OnboardingCameraModal
        open={cameraModalOpen}
        onOpenChange={setCameraModalOpen}
        webcamRef={webcamRef}
        onCapture={capturePhoto}
      />
    </div>
  );
}