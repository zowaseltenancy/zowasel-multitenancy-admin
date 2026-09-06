'use client';

import { useState } from 'react';
import { Landmark, Eye, EyeOff } from 'lucide-react';
import { StaffMember } from '@/types/staff';
import { EmploymentOverviewCard } from '../cards/EmploymentOverviewCard';
import { ContactCard } from '../cards/ContactCard';
import { LifecycleLeaveCard } from '../cards/LifecycleLeaveCard';
import { TabKey } from '../ProfileTabs';

interface OverviewTabProps {
  staff: StaffMember;
  roleName: string;
  onNavigateTab: (tab: TabKey) => void;
  onRequestLeave?: () => void;
}

export function OverviewTab({
  staff,
  roleName,
  onNavigateTab,
}: OverviewTabProps) {
  const [showAccount, setShowAccount] = useState(false);

  const maskNuban = (num?: string) => {
    if (!num) return '—';
    if (showAccount) return num;
    if (num.length <= 4) return num;
    return `••••••••${num.slice(-4)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Primary Left Column */}
      <div className="lg:col-span-8 space-y-5">
        <EmploymentOverviewCard
          staff={staff}
          roleName={roleName}
          onViewFullDetails={() => onNavigateTab('department')}
        />

        {/* Payroll & Banking Information from Onboarding */}
        <div className="border border-border/60 rounded-2xl bg-card p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-[#44883C]" />
              <h3 className="text-sm font-bold tracking-tight text-foreground">
                Payroll Disbursement & Banking Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3.5 gap-x-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground block">Disbursement Bank</span>
              <p className="font-semibold text-foreground mt-0.5">{staff.bank?.bankName || '—'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Account Number</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-foreground font-mono">
                  {maskNuban(staff.bank?.accountNumber)}
                </span>
                {staff.bank?.accountNumber && (
                  <button
                    type="button"
                    onClick={() => setShowAccount(!showAccount)}
                    className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                    title={showAccount ? 'Hide account' : 'Show account'}
                  >
                    {showAccount ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Branch Sort Code</span>
              <p className="font-semibold text-foreground mt-0.5 font-mono">{staff.bank?.sortCode || '—'}</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">Tax ID / TIN</span>
              <p className="font-semibold text-foreground mt-0.5 font-mono">{staff.bank?.taxId || '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Right Column */}
      <div className="lg:col-span-4 space-y-5">
        <ContactCard staff={staff} />

        <LifecycleLeaveCard
          status={staff.status}
          statusHistory={staff.statusHistory}
          onNavigateStatus={() => onNavigateTab('status_history')}
        />
      </div>
    </div>
  );
}
