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
    <div className="space-y-8 sm:space-y-10">
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
      <div className="space-y-6 pt-7 border-t border-border/60">
        <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Calendar className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            Biodata & Demographics
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7">
          <div className="space-y-2.5">
            <Label htmlFor="dob" className="text-xs font-semibold text-foreground flex items-center">
              Date of Birth <span className="text-destructive font-bold ml-0.5">*</span>
            </Label>
            <Input
              id="dob"
              type="date"
              {...register('personalInfo.dateOfBirth')}
              className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
            {errors.personalInfo?.dateOfBirth && (
              <p className="text-[11px] text-destructive">{errors.personalInfo.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="genderInput" className="text-xs font-semibold text-foreground flex items-center">
              Gender <span className="text-destructive font-bold ml-0.5">*</span>
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
