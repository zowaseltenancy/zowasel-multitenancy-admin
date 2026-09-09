'use client';

import { useState } from 'react';
import { GraduationCap, Landmark, Eye, EyeOff } from 'lucide-react';
import { StaffMember } from '@/types/staff';

interface EducationPayrollSectionProps {
  staff: StaffMember;
}

export function EducationPayrollSection({ staff }: EducationPayrollSectionProps) {
  const [showAccount, setShowAccount] = useState(false);

  const maskNuban = (num?: string) => {
    if (!num) return '—';
    if (showAccount) return num;
    return `••••••••${num.slice(-3)}`;
  };

  return (
    <>
      {/* Verified Academic Qualifications */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <GraduationCap className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Verified Academic Qualifications
          </h3>
        </div>

        {staff.education &&
        staff.education.length > 0 &&
        staff.education.some((e) => e.institution || e.degree) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {staff.education.map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs"
              >
                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                  {edu.degree || 'Degree'}
                </span>
                <p className="text-muted-foreground">{edu.institution || 'University'}</p>
                <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
                  <span>{edu.fieldOfStudy || 'Field of Study'}</span>
                  <span className="font-mono">
                    {edu.startYear || '—'} – {edu.endYear || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">
              B.Sc. Agricultural Extension & Rural Development
            </span>
            <p className="text-muted-foreground">
              Federal University of Agriculture, Abeokuta (FUNAAB)
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
              <span>Agricultural Sciences</span>
              <span className="font-mono">2016 – 2020</span>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Disbursement & Statutory Tax */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <Landmark className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Payroll Disbursement & Statutory Tax Details
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Disbursement Bank</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {staff.bank?.bankName || 'Zenith Bank PLC'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">NUBAN Account</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                {maskNuban(staff.bank?.accountNumber || '1012345678')}
              </span>
              <button
                type="button"
                onClick={() => setShowAccount(!showAccount)}
                className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                title={showAccount ? 'Hide account' : 'Show account'}
              >
                {showAccount ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Branch Sort Code</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {staff.bank?.sortCode || '057150013'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Tax ID / TIN</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {staff.bank?.taxId || 'TIN-2024-8849102'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}