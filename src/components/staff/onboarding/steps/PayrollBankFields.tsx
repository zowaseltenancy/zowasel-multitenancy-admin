'use client';

import React from 'react';
import { Landmark, CreditCard, ShieldCheck } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StaffFormValues } from '@/lib/validations/staff';

interface PayrollBankFieldsProps {
  register: UseFormRegister<StaffFormValues>;
}

export function PayrollBankFields({ register }: PayrollBankFieldsProps) {
  return (
    <div className="space-y-6 pt-7 border-t border-border/60">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          <Landmark className="h-3.5 w-3.5" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Payroll Disbursement & Tax Information
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 sm:gap-y-7">
        <div className="space-y-2.5">
          <Label htmlFor="bankName" className="text-xs font-semibold text-foreground block">
            Disbursement Bank Name
          </Label>
          <div className="relative">
            <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="bankName"
              placeholder="e.g. First Bank of Nigeria"
              {...register('bank.bankName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="accountNumber" className="text-xs font-semibold text-foreground block">
            Account Number (10-Digit NUBAN)
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="accountNumber"
              placeholder="10-digit NUBAN"
              {...register('bank.accountNumber')}
              className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="sortCode" className="text-xs font-semibold text-foreground block">
            Branch Sort Code
          </Label>
          <Input
            id="sortCode"
            placeholder="e.g. 011152"
            {...register('bank.sortCode')}
            className="h-11 text-sm font-mono rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="taxId" className="text-xs font-semibold text-foreground block">
            Tax Identification (TIN)
          </Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="taxId"
              placeholder="e.g. 12345678-0001"
              {...register('bank.taxId')}
              className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-foreground focus-visible:ring-[#44883C]/20 focus-visible:border-[#44883C]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
