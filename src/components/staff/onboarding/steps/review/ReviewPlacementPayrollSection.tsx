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
      <div id="rev-section-placement" className="p-3.5 space-y-2 scroll-mt-6">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5 text-[#44883C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3A. Corporate Placement & Designation
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Department</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateDept}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Designated Role</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{candidateRole}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Staff ID</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{employment?.employeeId || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Employment Type</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{employment?.employmentType || 'full-time'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Date of Joining</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{employment?.dateOfJoining || '—'}</p>
          </div>
        </div>
      </div>

      {/* 6. Payroll Disbursement & Statutory Tax */}
      <div id="rev-section-payroll" className="p-3.5 space-y-2 scroll-mt-6">
        <div className="flex items-center justify-between pb-1 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Landmark className="h-3.5 w-3.5 text-[#00A651]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3B. Payroll Disbursement & Statutory Tax
            </span>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-[11px] font-semibold text-[#008C44] dark:text-[#00C862] hover:underline cursor-pointer"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground block">Disbursement Bank</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{bank?.bankName || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Account Number (NUBAN)</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{bank?.accountNumber || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Branch Sort Code</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{bank?.sortCode || '—'}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block">Tax ID / TIN</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{bank?.taxId || '—'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
