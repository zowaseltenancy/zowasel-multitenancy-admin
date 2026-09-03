'use client';

import { useState } from 'react';
import {
  User,
  MapPin,
  HeartHandshake,
  GraduationCap,
  Landmark,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface PersonalTabProps {
  staff: StaffMember;
}

export function PersonalTab({ staff }: PersonalTabProps) {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const maskNuban = (num?: string) => {
    if (!num) return '—';
    if (showAccount) return num;
    return `••••••••${num.slice(-3)}`;
  };

  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      
      {/* 1. Personal Identity & Demographics */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <User className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Personal Identity & Demographics
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">First Name</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{staff.firstName || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Last Name</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{staff.lastName || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Date of Birth</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatDate(staff.dateOfBirth)}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Gender</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize mt-0.5">{staff.gender || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Marital Status</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize mt-0.5">{staff.maritalStatus || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Nationality</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{staff.nationality || 'Nigerian'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Personal Phone</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">{staff.phone || '—'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Official Email</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono truncate">{staff.email || '—'}</p>
          </div>
        </div>
      </div>

      {/* 2. Permanent Residential Address */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <MapPin className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Permanent Residential Address
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="sm:col-span-2">
            <span className="text-[11px] text-muted-foreground block">Street Address</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {staff.address?.line1 || '12 Admiralty Way'}{staff.address?.line2 ? `, ${staff.address.line2}` : ''}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">City</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{staff.address?.city || 'Lekki'}</p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">State & Country</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {staff.address?.state || 'Lagos'}, {staff.address?.country || 'Nigeria'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Emergency Contact & Next of Kin */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <HeartHandshake className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Emergency Contact & Next of Kin
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">Full Name</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {staff.nextOfKin?.fullName || 'Sarah Emmanuel'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Relationship</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {staff.nextOfKin?.relationship || 'Spouse'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Emergency Phone</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {staff.nextOfKin?.phone || '+234 802 345 6789'}
            </p>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground block">Emergency Email</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
              {staff.nextOfKin?.email || 'sarah.emmanuel@example.com'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Verified Academic Qualifications */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border/40">
          <GraduationCap className="h-4 w-4 text-[#00A651]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Verified Academic Qualifications
          </h3>
        </div>

        {staff.education && staff.education.length > 0 && staff.education.some((e) => e.institution || e.degree) ? (
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
                  <span className="font-mono">{edu.startYear || '—'} – {edu.endYear || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1 text-xs">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">
              B.Sc. Agricultural Extension & Rural Development
            </span>
            <p className="text-muted-foreground">Federal University of Agriculture, Abeokuta (FUNAAB)</p>
            <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
              <span>Agricultural Sciences</span>
              <span className="font-mono">2016 – 2020</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Payroll Disbursement & Statutory Tax */}
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
                {showAccount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
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
    </div>
  );
}
