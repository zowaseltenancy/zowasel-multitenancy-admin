'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { StaffFormValues } from '@/lib/validations/staff';
import { ResidentialAddressFields } from './ResidentialAddressFields';
import { NextOfKinFields } from './NextOfKinFields';

interface StepAddressAndKinProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  kinPhoneCode: string;
  setKinPhoneCode: (code: string) => void;
}

export function StepAddressAndKin({
  register,
  errors,
  kinPhoneCode,
  setKinPhoneCode,
}: StepAddressAndKinProps) {
  return (
    <div className="space-y-8">
      <ResidentialAddressFields register={register} errors={errors} />
      <NextOfKinFields
        register={register}
        errors={errors}
        kinPhoneCode={kinPhoneCode}
        setKinPhoneCode={setKinPhoneCode}
      />
    </div>
  );
}
