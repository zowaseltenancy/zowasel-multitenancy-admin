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
    <div className="space-y-6 pt-7 border-t border-border/60">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
          <User className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Basic Identity
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7">
        <div className="space-y-2.5">
          <Label htmlFor="firstName" className="text-xs font-semibold text-foreground flex items-center">
            First Name <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="firstName"
              placeholder="e.g. Oluwaseun"
              {...register('personalInfo.firstName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
          {errors.personalInfo?.firstName && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="lastName" className="text-xs font-semibold text-foreground flex items-center">
            Last Name <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="lastName"
              placeholder="e.g. Adeyemi"
              {...register('personalInfo.lastName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
          {errors.personalInfo?.lastName && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center">
            Official Work Email <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="e.g. oluwaseun@zowasel.com"
              {...register('personalInfo.email')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
          {errors.personalInfo?.email && (
            <p className="text-[11px] text-destructive">{errors.personalInfo.email.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center">
            Phone Number <span className="text-destructive font-bold ml-0.5">*</span>
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
                className="h-11 text-sm rounded-xl font-medium bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
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