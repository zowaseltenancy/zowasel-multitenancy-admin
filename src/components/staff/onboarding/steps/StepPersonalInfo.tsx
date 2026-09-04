'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StaffFormValues } from '@/lib/validations/staff';
import { ProfilePhotoStudio } from './ProfilePhotoStudio';
import { TypeableDropdown } from '../TypeableDropdown';
import { PersonalInfoIdentityFields } from './PersonalInfoIdentityFields';

interface StepPersonalInfoProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  avatarUrl?: string;
  onAvatarChange: (url: string) => void;
  onOpenCamera: () => void;
  personalPhoneCode: string;
  setPersonalPhoneCode: (code: string) => void;
  gender?: string;
  onGenderChange: (gender: string) => void;
}

export function StepPersonalInfo({
  register,
  errors,
  avatarUrl,
  onAvatarChange,
  onOpenCamera,
  personalPhoneCode,
  setPersonalPhoneCode,
  gender,
  onGenderChange,
}: StepPersonalInfoProps) {
  return (
    <div className="space-y-8 sm:space-y-9">
      <ProfilePhotoStudio
        avatarUrl={avatarUrl}
        onAvatarChange={onAvatarChange}
        onOpenCamera={onOpenCamera}
      />

      {/* Sub-Section 1: Basic Identity */}
      <PersonalInfoIdentityFields
        register={register}
        errors={errors}
        personalPhoneCode={personalPhoneCode}
        setPersonalPhoneCode={setPersonalPhoneCode}
      />

      {/* Sub-Section 2: Biodata & Demographics */}
      <div className="space-y-6 pt-6 border-t border-border/60">
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <Calendar className="h-4 w-4 text-[#44883C]" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Biodata & Demographics
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
              Date of Birth *
            </Label>
            <Input
              id="dob"
              type="date"
              {...register('personalInfo.dateOfBirth')}
              className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
            {errors.personalInfo?.dateOfBirth && (
              <p className="text-[11px] text-destructive">{errors.personalInfo.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="genderInput" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
              Gender *
            </Label>
            <TypeableDropdown
              id="genderInput"
              value={gender || ''}
              onChange={onGenderChange}
              options={['Male', 'Female', 'Non-Binary', 'Prefer not to say', 'Other']}
              placeholder="Type or select gender..."
              error={errors.personalInfo?.gender?.message}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
