'use client';

import React from 'react';
import { Briefcase, RefreshCw, ShieldCheck } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StaffFormValues } from '@/lib/validations/staff';
import { generateStaffId } from '../onboardingConstants';
import { PlacementDeptRoleFields } from './PlacementDeptRoleFields';

interface PlacementFieldsProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  watch: UseFormWatch<StaffFormValues>;
  setValue: UseFormSetValue<StaffFormValues>;
  /** { id, name }: the staff endpoint takes departmentId. */
  departments: { id: string; name: string }[];
  roles: { id: string; name: string }[];
}

export function PlacementFields({
  register,
  errors,
  watch,
  setValue,
  departments,
  roles,
}: PlacementFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          <Briefcase className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Corporate Placement & Designation
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7">
        <PlacementDeptRoleFields
          watch={watch}
          setValue={setValue}
          errors={errors}
          departments={departments}
          roles={roles}
        />

        <div className="space-y-2.5">
          <Label className="text-xs font-semibold text-foreground flex items-center">
            Employment Type <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Select
            value={watch('employment.employmentType')}
            onValueChange={(val) => setValue('employment.employmentType', val as any, { shouldValidate: true, shouldDirty: true })}
          >
            <SelectTrigger id="employmentTypeSelect" className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time" className="text-xs">Full-Time</SelectItem>
              <SelectItem value="part-time" className="text-xs">Part-Time</SelectItem>
              <SelectItem value="contract" className="text-xs">Contract</SelectItem>
              <SelectItem value="intern" className="text-xs">Intern</SelectItem>
            </SelectContent>
          </Select>
          {errors.employment?.employmentType && (
            <p className="text-[11px] text-destructive">{errors.employment.employmentType.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="dateOfJoining" className="text-xs font-semibold text-foreground flex items-center">
            Date of Joining <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input
            id="dateOfJoining"
            type="date"
            {...register('employment.dateOfJoining')}
            className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
          {errors.employment?.dateOfJoining && (
            <p className="text-[11px] text-destructive">{errors.employment.dateOfJoining.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="employeeId" className="text-xs font-semibold text-foreground block">
              Staff ID
            </Label>
            <span className="text-[10px] font-semibold text-[#44883C] dark:text-[#5cb850] bg-[#44883C]/10 px-2 py-0.5 rounded-full border border-[#44883C]/20">
              Auto-generated
            </span>
          </div>
          <div className="relative flex items-center">
            <Input
              id="employeeId"
              placeholder="STA-2026-0000"
              {...register('employment.employeeId')}
              className="h-11 text-sm font-mono font-medium rounded-xl bg-background text-foreground pr-10 focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
            <button
              type="button"
              onClick={() => setValue('employment.employeeId', generateStaffId(), { shouldValidate: true, shouldDirty: true })}
              title="Regenerate Staff ID"
              className="absolute right-3 p-1 text-muted-foreground hover:text-[#44883C] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/25 border border-border/50 text-xs text-muted-foreground self-end h-11">
          <ShieldCheck className="h-4 w-4 text-[#44883C] shrink-0" />
          <span className="text-[11px] leading-tight">Staff ID is generated automatically according to corporate numbering.</span>
        </div>
      </div>
    </div>
  );
}
