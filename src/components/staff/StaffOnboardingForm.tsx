'use client';

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
  defaultValues?: Partial<StaffFormValues>;
  roles: { id: string; name: string }[];
  departments: string[];
  onSubmit: (data: StaffFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function StaffOnboardingForm({
  defaultValues,
  roles,
  departments,
  onSubmit,
  isSubmitting = false,
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
  } = useStaffOnboardingForm({ defaultValues, roles, onSubmit });

  return (
    <div className="space-y-3.5 w-full max-w-7xl mx-auto">
      <OnboardingHeader
        step={step}
        completedDetailsCount={completedDetailsCount}
        totalDetailsCount={totalDetailsCount}
        onSaveDraft={() => toast.success('Draft progress saved successfully. You can safely resume later.')}
      />

      <div className="border border-border/60 rounded-2xl bg-card shadow-xs overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60 flex-1">
          <div ref={formScrollRef} className="lg:col-span-9 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
            <div className="space-y-6 sm:space-y-8">
              <StepCardHeader stepNumber={step + 1} title={currentStage.title} description={currentStage.description} />

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

            <div className="pt-6 mt-8 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-[#44883C] shrink-0" />
              <span>All entered data is securely encrypted and auto-saved in compliance with enterprise policies.</span>
            </div>
          </div>

          <OnboardingRightRail
            step={step}
            avatarUrl={currentValues.personalInfo?.avatarUrl}
            candidateInitials={candidateInitials}
            candidateName={candidateName}
            candidateEmail={currentValues.personalInfo?.email}
            currentStageFields={currentStageFields}
            stageDoneCount={stageDoneCount}
            stageTotalCount={stageTotalCount}
            completedDetailsCount={completedDetailsCount}
            totalDetailsCount={totalDetailsCount}
          />
        </div>

        <OnboardingFooterNav
          step={step}
          lastSavedTime={lastSavedTime}
          isSubmitting={isSubmitting}
          onBack={() => { if (step > 0) goToStep(step - 1); }}
          onNext={() => goToStep(step + 1)}
          onSubmit={handleSubmit(onFinalSubmit)}
        />
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