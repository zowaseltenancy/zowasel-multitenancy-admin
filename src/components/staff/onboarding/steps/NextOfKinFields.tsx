'use client';

import React, { useState } from 'react';
import { HeartHandshake, User, Mail, ChevronDown } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StaffFormValues } from '@/lib/validations/staff';
import { CountryCodeDropdown } from '../CountryCodeDropdown';

interface NextOfKinFieldsProps {
  register: UseFormRegister<StaffFormValues>;
  errors: FieldErrors<StaffFormValues>;
  watch?: UseFormWatch<StaffFormValues>;
  kinPhoneCode: string;
  setKinPhoneCode: (code: string) => void;
}

export function NextOfKinFields({
  register,
  errors,
  watch,
  kinPhoneCode,
  setKinPhoneCode,
}: NextOfKinFieldsProps) {
  const currentFullName = watch ? watch('nextOfKin.fullName') : '';
  const currentPhone = watch ? watch('nextOfKin.phone') : '';
  const [isOpen, setIsOpen] = useState(() => Boolean(currentFullName || currentPhone || errors.nextOfKin));

  return (
    <div className="space-y-6 pt-7 border-t border-border/60">
      {/* Header with interactive Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <HeartHandshake className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
              Next of Kin & Emergency Contact <span className="text-xs font-normal text-muted-foreground lowercase">(optional)</span>
            </h3>
            <p className="text-[11px] text-muted-foreground">Toggle to reveal emergency contact details</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isOpen ? 'bg-purple-600' : 'bg-muted border-border/60'
          }`}
          role="switch"
          aria-checked={isOpen}
          title={isOpen ? 'Click to hide Next of Kin fields' : 'Click to reveal Next of Kin fields'}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isOpen ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full p-3.5 rounded-xl bg-muted/20 border border-dashed border-border/70 hover:border-[#44883C]/50 text-xs text-muted-foreground flex items-center justify-between cursor-pointer transition-colors"
        >
          <span>Next of kin details are collapsed. Click to designate an emergency contact.</span>
          <span className="text-xs font-bold text-[#44883C] hover:underline shrink-0">
            + Reveal Fields
          </span>
        </button>
      )}

      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7 animate-in fade-in-50 duration-200">
        <div className="space-y-2.5">
          <Label htmlFor="kinName" className="text-xs font-semibold text-foreground block">
            Next of Kin Full Name <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="kinName"
              placeholder="e.g. Bukola Adeyemi"
              {...register('nextOfKin.fullName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
          {errors.nextOfKin?.fullName && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="kinRel" className="text-xs font-semibold text-foreground block">
            Relationship <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="kinRel"
            placeholder="e.g. Spouse / Brother / Mother"
            {...register('nextOfKin.relationship')}
            className="h-11 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
          {errors.nextOfKin?.relationship && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.relationship.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="kinPhone" className="text-xs font-semibold text-foreground block">
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
                className="h-11 text-sm rounded-xl font-medium bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
              />
            </div>
          </div>
          {errors.nextOfKin?.phone && (
            <p className="text-[11px] text-destructive">{errors.nextOfKin.phone.message}</p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="kinEmail" className="text-xs font-semibold text-foreground block">
            Emergency Email <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="kinEmail"
              type="email"
              placeholder="e.g. bukola@example.com"
              {...register('nextOfKin.email')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-2.5">
          <Label htmlFor="kinAddress" className="text-xs font-semibold text-foreground block">
            Residential Address <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="kinAddress"
            rows={2}
            placeholder="Emergency contact residence address..."
            {...register('nextOfKin.address')}
            className="text-sm rounded-xl bg-background text-foreground min-h-20 focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
        </div>
      </div>
      )}
    </div>
  );
}
