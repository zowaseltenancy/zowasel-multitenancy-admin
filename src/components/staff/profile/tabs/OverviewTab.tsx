'use client';

import { useState } from 'react';
import {
  User,
  MapPin,
  HeartHandshake,
  Briefcase,
  Landmark,
  Copy,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { toast } from 'sonner';

interface OverviewTabProps {
  staff: StaffMember;
  roleName: string;
  onNavigateTab?: (tab: any) => void;
}

export function OverviewTab({ staff, roleName }: OverviewTabProps) {
  const [showAccount, setShowAccount] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const maskNuban = (num?: string) => {
    if (!num) return '—';
    if (showAccount) return num;
    if (num.length <= 4) return num;
    return `••••••••${num.slice(-4)}`;
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

  const hasKinData = Boolean(
    staff.nextOfKin?.fullName ||
    staff.nextOfKin?.phone ||
    staff.nextOfKin?.email ||
    staff.nextOfKin?.relationship ||
    staff.nextOfKin?.address
  );

  return (
    <div className="space-y-6">
      {/* SECTION 1: Personal Information & Identity (Onboarding Stage 1) */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <User className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            1. Personal Information & Identity
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs">
          <div>
            <span className="text-[11px] text-muted-foreground block">First Name</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{staff.firstName || '—'}</p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Last Name</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">{staff.lastName || '—'}</p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Official Work Email</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-foreground font-mono text-[12.5px] truncate">
                {staff.email || '—'}
              </span>
              {staff.email && (
                <button
                  type="button"
                  onClick={() => handleCopy(staff.email, 'Work Email')}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                  title="Copy email"
                >
                  {copiedField === 'Work Email' ? (
                    <Check className="h-3 w-3 text-[#44883C]" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-60" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Phone Number</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-foreground font-mono text-[12.5px]">
                {staff.phone || staff.mobilenumber || '—'}
              </span>
              {(staff.phone || staff.mobilenumber) && (
                <button
                  type="button"
                  onClick={() => handleCopy(staff.phone || staff.mobilenumber || '', 'Phone Number')}
                  className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                  title="Copy phone"
                >
                  {copiedField === 'Phone Number' ? (
                    <Check className="h-3 w-3 text-[#44883C]" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-60" />
                  )}
                </button>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Date of Birth</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">
              {staff.dateOfBirth || '—'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Gender</span>
            <p className="font-semibold text-foreground capitalize text-[13px] mt-0.5">
              {staff.gender || '—'}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-muted-foreground block">Profile Headshot</span>
            <p className="font-semibold text-foreground text-[13px] mt-0.5">
              {staff.avatarUrl ? 'Attached ✓' : 'Default Monogram'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Permanent Residential Address & Next of Kin (Onboarding Stage 2) */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            2. Permanent Residential Address & Next of Kin
          </h3>
        </div>

        {/* 2A. Residential Address */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Permanent Residential Address
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs">
            <div className="sm:col-span-2">
              <span className="text-[11px] text-muted-foreground block">Location / Street</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.address?.line1 || staff.workLocation || '—'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">City</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.address?.city || '—'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">State / Region</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.address?.state || '—'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Country</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.address?.country || staff.country || 'Nigeria'}
              </p>
            </div>
          </div>
        </div>

        {/* 2B. Next of Kin & Emergency Contact */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Next of Kin & Emergency Contact
            </span>
          </div>

          {hasKinData ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs">
              <div>
                <span className="text-[11px] text-muted-foreground block">Full Name</span>
                <p className="font-semibold text-foreground text-[13px] mt-0.5">
                  {staff.nextOfKin?.fullName || '—'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Relationship</span>
                <p className="font-semibold text-foreground text-[13px] mt-0.5">
                  {staff.nextOfKin?.relationship || '—'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Emergency Phone</span>
                <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">
                  {staff.nextOfKin?.phone || '—'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Emergency Email</span>
                <p className="font-semibold text-foreground text-[13px] mt-0.5">
                  {staff.nextOfKin?.email || '—'}
                </p>
              </div>
              {staff.nextOfKin?.address && (
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-[11px] text-muted-foreground block">Residential Address</span>
                  <p className="font-semibold text-foreground text-[13px] mt-0.5">
                    {staff.nextOfKin.address}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Not provided (Optional emergency contact details were skipped during onboarding)
            </p>
          )}
        </div>
      </div>

      {/* SECTION 3: Corporate Placement & Payroll (Onboarding Stage 3) */}
      <div className="border border-border/60 rounded-2xl bg-card p-5 sm:p-6 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            3. Corporate Placement & Payroll
          </h3>
        </div>

        {/* 3A. Placement */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Placement & Designation
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">Department</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.departmentObj?.name || staff.department}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Designated Role</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {roleName}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Staff ID</span>
              <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">
                {staff.employeeId || staff.id}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Employment Type</span>
              <p className="font-semibold text-foreground capitalize text-[13px] mt-0.5">
                {staff.employmentType || staff.employmenttype || 'Full-time'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Date of Joining</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {formatDate(staff.dateJoined || staff.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 3B. Payroll & Banking */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-2">
            <Landmark className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Payroll Disbursement & Tax Information
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">Disbursement Bank</span>
              <p className="font-semibold text-foreground text-[13px] mt-0.5">
                {staff.bank?.bankName || '—'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Account Number (NUBAN)</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-foreground font-mono text-[12.5px]">
                  {maskNuban(staff.bank?.accountNumber)}
                </span>
                {staff.bank?.accountNumber && (
                  <button
                    type="button"
                    onClick={() => setShowAccount(!showAccount)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                    title={showAccount ? 'Hide account' : 'Show account'}
                  >
                    {showAccount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Branch Sort Code</span>
              <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">
                {staff.bank?.sortCode || '—'}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Tax ID / TIN</span>
              <p className="font-semibold text-foreground font-mono text-[12.5px] mt-0.5">
                {staff.bank?.taxId || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
