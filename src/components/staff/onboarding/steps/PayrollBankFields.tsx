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
    <div className="space-y-6 pt-6 border-t border-border/60">
      <div className="flex items-center gap-2 pb-2 border-b border-border/60">
        <Landmark className="h-4 w-4 text-[#44883C]" />
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Payroll Disbursement & Tax Information
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-10 gap-y-6 sm:gap-y-8">
        <div className="space-y-2">
          <Label htmlFor="bankName" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Disbursement Bank Name
          </Label>
          <div className="relative">
            <Landmark className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="bankName"
              placeholder="e.g. First Bank of Nigeria"
              {...register('bank.bankName')}
              className="h-11 pl-10 text-sm rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Account Number (10-Digit NUBAN)
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="accountNumber"
              placeholder="10-digit NUBAN"
              {...register('bank.accountNumber')}
              className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortCode" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Branch Sort Code
          </Label>
          <Input
            id="sortCode"
            placeholder="e.g. 011152"
            {...register('bank.sortCode')}
            className="h-11 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 block">
            Tax Identification (TIN)
          </Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="taxId"
              placeholder="e.g. 12345678-0001"
              {...register('bank.taxId')}
              className="h-11 pl-10 text-sm font-mono rounded-xl bg-background text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
