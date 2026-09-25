import { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Webcam from 'react-webcam';
import { toast } from 'sonner';

import { staffEditFormSchema, staffFormSchema, StaffFormValues } from '@/lib/validations/staff';
import { ONBOARDING_STAGES, getDefaultStaffFormValues, formatStaffSubmitData } from './onboardingConstants';
import { useOnboardingChecklist } from './useOnboardingChecklist';
import { usePhoneCountryCodes } from './usePhoneCountryCodes';

interface UseStaffOnboardingFormOptions {
  initialStep?: number;
  defaultValues?: Partial<StaffFormValues>;
  roles: { id: string; name: string }[];
  onSubmit: (data: StaffFormValues) => void;
  /**
   * 'edit' relaxes the required-ness of the fields the staff record has no
   * column for — see staffEditFormSchema. Without it the edit screen could
   * never submit, because those fields are seeded empty and the review stage
   * shows no validation errors.
   */
  mode?: 'onboard' | 'edit';
}

export function useStaffOnboardingForm({
  initialStep = 0,
  defaultValues,
  roles,
  onSubmit,
  mode = 'onboard',
}: UseStaffOnboardingFormOptions) {
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    if (typeof initialStep === 'number' && initialStep >= 0 && initialStep < ONBOARDING_STAGES.length) {
      setStep(initialStep);
    }
  }, [initialStep]);

  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const webcamRef = useRef<Webcam>(null);
  const formScrollRef = useRef<HTMLDivElement>(null);

  const methods = useForm<z.input<typeof staffFormSchema>>({
    // The form stays typed on the strict shape either way: the edit schema
    // differs only in what it demands, and getDefaultStaffFormValues fills
    // every field, so the values handed to onSubmit have the same shape in
    // both modes.
    resolver: zodResolver(
      (mode === 'edit' ? staffEditFormSchema : staffFormSchema) as typeof staffFormSchema,
    ),
    defaultValues: getDefaultStaffFormValues(defaultValues),
    mode: 'onTouched',
  });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods;
  const currentValues = watch() as StaffFormValues;

  const { personalPhoneCode, setPersonalPhoneCode, kinPhoneCode, setKinPhoneCode } =
    usePhoneCountryCodes(defaultValues, setValue);

  useEffect(() => {
    const now = new Date();
    setLastSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [step]);

  const goToStep = useCallback((targetStep: number) => {
    if (targetStep === step || targetStep < 0 || targetStep >= ONBOARDING_STAGES.length) return;
    setStep(targetStep);
    formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const checklist = useOnboardingChecklist(step, currentValues, roles);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setValue('personalInfo.avatarUrl', imageSrc, { shouldValidate: true, shouldDirty: true });
      setCameraModalOpen(false);
      toast.success('Profile photo captured');
    }
  }, [webcamRef, setValue]);

  const onFinalSubmit = async (data: any) => {
    try {
      onSubmit(formatStaffSubmitData(data, personalPhoneCode, kinPhoneCode));
    } catch {
      toast.error('Submission failed. Please check form errors.');
    }
  };

  const currentStage = ONBOARDING_STAGES[step];

  return {
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
    ...checklist,
  };
}