'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { StaffFormValues } from '@/lib/validations/staff';
import { PlacementFields } from './PlacementFields';
import { PayrollBankFields } from './PayrollBankFields';

interface StepPlacementPayrollProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  watch: UseFormWatch<StaffFormValues>;
  setValue: UseFormSetValue<StaffFormValues>;
  departments: string[];
  roles: { id: string; name: string }[];
}

export function StepPlacementPayroll({
  register,
  errors,
  watch,
  setValue,
  departments,
  roles,
}: StepPlacementPayrollProps) {
  return (
    <div className="space-y-8">
      <PlacementFields
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
        departments={departments}
        roles={roles}
      />
      <PayrollBankFields register={register} />
    </div>
  );
}
