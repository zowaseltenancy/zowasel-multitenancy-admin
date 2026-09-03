'use client';

import { StaffMember } from '@/types/staff';
import { AboutCard } from '../cards/AboutCard';
import { EmploymentOverviewCard } from '../cards/EmploymentOverviewCard';
import { AssignedProjectsCard } from '../cards/AssignedProjectsCard';
import { ContactCard } from '../cards/ContactCard';
import { RecentActivityCard } from '../cards/RecentActivityCard';
import { TabKey } from '../ProfileTabs';

interface OverviewTabProps {
  staff: StaffMember;
  roleName: string;
  onNavigateTab: (tab: TabKey) => void;
  onSendMessage: () => void;
}

export function OverviewTab({
  staff,
  roleName,
  onNavigateTab,
  onSendMessage,
}: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Primary Left Column (65–70% / 8 Columns on Desktop) */}
      <div className="lg:col-span-8 space-y-5">
        {/* A. About Card */}
        <AboutCard staff={staff} />

        {/* B. Employment Overview Card */}
        <EmploymentOverviewCard
          staff={staff}
          roleName={roleName}
          onViewFullDetails={() => onNavigateTab('employment')}
        />

        {/* C. Assigned Projects Card */}
        <AssignedProjectsCard
          projects={staff.projects}
          onViewAllProjects={() => onNavigateTab('employment')}
        />
      </div>

      {/* Supporting Right Column (30–35% / 4 Columns on Desktop) */}
      <div className="lg:col-span-4 space-y-5">
        {/* D. Contact Card */}
        <ContactCard staff={staff} onSendMessage={onSendMessage} />

        {/* E. Recent Activity Card */}
        <RecentActivityCard
          activities={staff.activities}
          onViewAllActivity={() => onNavigateTab('activity')}
        />
      </div>
    </div>
  );
}
