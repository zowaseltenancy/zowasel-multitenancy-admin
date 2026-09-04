'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StaffFormValues } from '@/lib/validations/staff';

interface ResidentialAddressFieldsProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
}

export function ResidentialAddressFields({
  register,
  errors,
}: ResidentialAddressFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-border/60">
        <MapPin className="h-4 w-4 text-[#44883C]" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Permanent Residential Address
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Location *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
              {...register('address.line1')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
          {errors.address?.line1 && (
            <p className="text-[11px] text-destructive">{errors.address.line1.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            City *
          </Label>
          <Input
            id="city"
            placeholder="e.g. Victoria Island / Ikeja"
            {...register('address.city')}
            className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
          />
          {errors.address?.city && (
            <p className="text-[11px] text-destructive">{errors.address.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            State / Region *
          </Label>
          <Input
            id="state"
            placeholder="e.g. Lagos State"
            {...register('address.state')}
            className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
          />
          {errors.address?.state && (
            <p className="text-[11px] text-destructive">{errors.address.state.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Country *
          </Label>
          <Input
            id="country"
            placeholder="e.g. Nigeria"
            {...register('address.country')}
            className="h-11 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
          />
          {errors.address?.country && (
            <p className="text-[11px] text-destructive">{errors.address.country.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
