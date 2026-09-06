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
      <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
          <MapPin className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Permanent Residential Address
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7">
        <div className="space-y-2.5">
          <Label htmlFor="location" className="text-xs font-semibold text-foreground flex items-center">
            Location <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
              {...register('address.line1')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
          {errors.address?.line1 && (
            <p className="text-[11px] text-destructive">{errors.address.line1.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="city" className="text-xs font-semibold text-foreground flex items-center">
            City <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input
            id="city"
            placeholder="e.g. Victoria Island / Ikeja"
            {...register('address.city')}
            className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
          {errors.address?.city && (
            <p className="text-[11px] text-destructive">{errors.address.city.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="state" className="text-xs font-semibold text-foreground flex items-center">
            State / Region <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input
            id="state"
            placeholder="e.g. Lagos State"
            {...register('address.state')}
            className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
          {errors.address?.state && (
            <p className="text-[11px] text-destructive">{errors.address.state.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="country" className="text-xs font-semibold text-foreground flex items-center">
            Country <span className="text-destructive font-bold ml-0.5">*</span>
          </Label>
          <Input
            id="country"
            placeholder="e.g. Nigeria"
            {...register('address.country')}
            className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
          {errors.address?.country && (
            <p className="text-[11px] text-destructive">{errors.address.country.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
