'use client';

import React from 'react';
import { HeartHandshake, User, Mail } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaffFormValues } from '@/lib/validations/staff';
import { CountryCodeDropdown } from '../CountryCodeDropdown';

interface NextOfKinFieldsProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  kinPhoneCode: string;
  setKinPhoneCode: (code: string) => void;
}

export function NextOfKinFields({
  register,
  errors,
  kinPhoneCode,
  setKinPhoneCode,
}: NextOfKinFieldsProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-border/60">
      <div className="flex items-center gap-2 pb-2 border-b border-border/60">
        <HeartHandshake className="h-4 w-4 text-[#00A651]" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Next of Kin & Emergency Contact <span className="text-xs font-normal text-muted-foreground capitalize">(Optional)</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="kinName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Next of Kin Full Name <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="kinName"
              placeholder="e.g. Bukola Adeyemi"
              {...register('nextOfKin.fullName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
          {errors.nextOfKin?.fullName && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="kinRel" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Relationship <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="kinRel"
            placeholder="e.g. Spouse / Brother / Mother"
            {...register('nextOfKin.relationship')}
            className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
          />
          {errors.nextOfKin?.relationship && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.relationship.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="kinPhone" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Emergency Phone Number <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <div className="flex items-center gap-2.5">
            <CountryCodeDropdown
              value={kinPhoneCode}
              onChange={setKinPhoneCode}
            />
            <div className="relative flex-1">
              <Input
                id="kinPhone"
                placeholder="803 123 4567"
                {...register('nextOfKin.phone')}
                className="h-11 text-sm rounded-xl font-medium bg-background text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          {errors.nextOfKin?.phone && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="kinEmail" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Emergency Email <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="kinEmail"
              type="email"
              placeholder="e.g. bukola@example.com"
              {...register('nextOfKin.email')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="kinAddress" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Residential Address <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="kinAddress"
            rows={2}
            placeholder="Emergency contact residence address..."
            {...register('nextOfKin.address')}
            className="text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100 min-h-20"
          />
        </div>
      </div>
    </div>
  );
}
