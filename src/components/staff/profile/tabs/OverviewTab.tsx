'use client';

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Primary Left Column */}
      <div className="lg:col-span-8 space-y-5">
        <EmploymentOverviewCard
          staff={staff}
          roleName={roleName}
          onViewFullDetails={() => onNavigateTab('department')}
        />
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
