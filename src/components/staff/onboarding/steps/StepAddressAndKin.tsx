'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { StaffFormValues } from '@/lib/validations/staff';
import { ResidentialAddressFields } from './ResidentialAddressFields';
import { NextOfKinFields } from './NextOfKinFields';

interface StepAddressAndKinProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  watch?: UseFormWatch<StaffFormValues>;
  kinPhoneCode: string;
  setKinPhoneCode: (code: string) => void;
}

export function StepAddressAndKin({
  register,
  errors,
  watch,
  kinPhoneCode,
  setKinPhoneCode,
}: StepAddressAndKinProps) {
  return (
    <div className="space-y-8 sm:space-y-10">
      <ResidentialAddressFields register={register} errors={errors} />
      <NextOfKinFields
        register={register}
        errors={errors}
        watch={watch}
        kinPhoneCode={kinPhoneCode}
        setKinPhoneCode={setKinPhoneCode}
      />
    </div>
  );
}
