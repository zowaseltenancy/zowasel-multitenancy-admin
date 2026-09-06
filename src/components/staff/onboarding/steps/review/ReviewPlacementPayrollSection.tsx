'use client';

import React from 'react';
import { Briefcase, Landmark, Pencil } from 'lucide-react';
import { StaffFormValues } from '@/lib/validations/staff';

interface ReviewPlacementPayrollSectionProps {
  employment?: StaffFormValues['employment'];
  bank?: StaffFormValues['bank'];
  candidateDept: string;
  candidateRole: string;
  onEdit: () => void;
}

export function ReviewPlacementPayrollSection({
  employment,
  bank,
  candidateDept,
  candidateRole,
  onEdit,
}: ReviewPlacementPayrollSectionProps) {
  return (
    <>
      {/* 5. Corporate Placement & Designation */}
      <div id="rev-section-placement" className="p-5 sm:p-6 space-y-3.5 scroll-mt-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              3A. Corporate Placement & Designation
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Department</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{candidateDept}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Designated Role</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{candidateRole}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Staff ID</span>
            <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{employment?.employeeId || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Employment Type</span>
            <p className="font-semibold text-foreground capitalize text-[13px] mt-0.5">{employment?.employmentType || 'full-time'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Date of Joining</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{employment?.dateOfJoining || '—'}</p>
          </div>
        </div>
      </div>

      {/* 6. Payroll Disbursement & Statutory Tax */}
      <div id="rev-section-payroll" className="p-5 sm:p-6 space-y-3.5 scroll-mt-6 border-t border-border/60">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              3B. Payroll Disbursement & Statutory Tax
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Disbursement Bank</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{bank?.bankName || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Account Number (NUBAN)</span>
            <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{bank?.accountNumber || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Branch Sort Code</span>
            <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{bank?.sortCode || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Tax ID / TIN</span>
            <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">{bank?.taxId || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
