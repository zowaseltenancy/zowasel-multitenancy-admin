'use client';

import { User, Mail } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StaffFormValues } from '@/lib/validations/staff';
import { CountryCodeDropdown } from '../CountryCodeDropdown';

interface PersonalInfoIdentityFieldsProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  personalPhoneCode: string;
  setPersonalPhoneCode: (code: string) => void;
}

export function PersonalInfoIdentityFields({
  register,
  errors,
  personalPhoneCode,
  setPersonalPhoneCode,
}: PersonalInfoIdentityFieldsProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-border/60">
      <div className="flex items-center gap-2 pb-2 border-b border-border/60">
        <User className="h-4 w-4 text-[#44883C]" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Basic Identity
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            First Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              placeholder="e.g. Oluwaseun"
              {...register('personalInfo.firstName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
          {errors.personalInfo?.firstName && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Last Name *
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              placeholder="e.g. Adeyemi"
              {...register('personalInfo.lastName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
          {errors.personalInfo?.lastName && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Official Work Email *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="e.g. oluwaseun@zowasel.com"
              {...register('personalInfo.email')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
          {errors.personalInfo?.email && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Phone Number *
          </Label>
          <div className="flex items-center gap-2.5">
            <CountryCodeDropdown
              value={personalPhoneCode}
              onChange={setPersonalPhoneCode}
            />
            <div className="relative flex-1">
              <Input
                id="phone"
                placeholder="802 345 6789"
                {...register('personalInfo.phone')}
                className="h-11 text-sm rounded-xl font-medium bg-background text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          {errors.personalInfo?.phone && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.phone.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}