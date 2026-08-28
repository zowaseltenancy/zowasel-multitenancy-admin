'use client';

import { notFound } from 'next/navigation';
import { useState } from 'react';

import { usePageHeader } from '@/components/layout/PageHeaderContext';
import KybStatusBadge from '@/components/shared/KybStatusBadge';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { getApiErrorMessage } from '@/lib/axios';
import { useOrganization, useOrganizations } from '../hooks/useOrganizations';

import OrganizationAgentsTab from './OrganizationAgentsTab';
import OrganizationKybTab from './OrganizationKybTab';
import OrganizationModulesTab from './OrganizationModulesTab';
import OrganizationProfileTab from './OrganizationProfileTab';
import OrganizationProjectsTab from './OrganizationProjectsTab';
import OrganizationTeamTab from './OrganizationTeamTab';
import OrganizationUsersTab from './OrganizationUsersTab';

interface Props {
  organizationId: string;
  moduleId?: string;
}

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'kyb', label: 'KYB Verification' },
  { key: 'modules', label: 'Active Modules' },
  { key: 'team', label: 'Team Members' },
  { key: 'users', label: 'Farmers & Users' },
  { key: 'agents', label: 'Field Agents' },
  { key: 'projects', label: 'Agro Projects' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function OrganizationDetailView({ organizationId, moduleId }: Props) {
  const {
    organizations,
    approveKyb,
    rejectKyb,
    markKybPending,
    toggleKeyOfficerStatus,
    assignStaff,
    swapAssignedStaff,
  } = useOrganizations();

  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  // GET /admin/businesses/{id}. Reading the row out of the *list* instead —
  // which is what this did — meant the page only ever had list-projection
  // fields: no team members, no key officers, no governance, no KYB documents.
  const detailQuery = useOrganization(organizationId);
  const organization = detailQuery.data;

  usePageHeader(organization?.name ?? 'Organization', organization?.businessId);

  if (detailQuery.isLoading) {
    return (
      <Card className="flex min-h-[240px] items-center justify-center p-6 text-sm text-muted-foreground">
        Loading organization…
      </Card>
    );
  }

  // A 404 from the API is a genuinely missing business; any other failure is
  // worth showing rather than disguising as "not found".
  if (detailQuery.isError) {
    const status = (detailQuery.error as { response?: { status?: number } } | null)?.response?.status;
    if (status === 404) notFound();
    return (
      <Card className="flex min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-foreground">Unable to load this organization</p>
        <p className="max-w-md text-xs text-muted-foreground">
          {getApiErrorMessage(detailQuery.error, 'Please try again.')}
        </p>
      </Card>
    );
  }

  if (!organization) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">
            {organization.businessId}
          </span>
          <span>•</span>
          <span className="text-sm text-muted-foreground">
            {organization.owner.email}
          </span>
        </div>
        <KybStatusBadge status={organization.kybStatus} />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/70'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <OrganizationProfileTab
          organization={organization}
          onAssignStaff={assignStaff}
          onSwapStaff={swapAssignedStaff}
        />
      )}

      {activeTab === 'kyb' && (
        <OrganizationKybTab
          organization={organization}
          onApprove={approveKyb}
          onReject={rejectKyb}
          onMarkPending={markKybPending}
        />
      )}

      {activeTab === 'modules' && (
        <OrganizationModulesTab organization={organization} />
      )}

      {activeTab === 'team' && (
        <OrganizationTeamTab
          organization={organization}
          onToggleOfficerStatus={toggleKeyOfficerStatus}
        />
      )}

      {activeTab === 'users' && (
        <OrganizationUsersTab organization={organization} />
      )}

      {activeTab === 'agents' && (
        <OrganizationAgentsTab organization={organization} />
      )}

      {activeTab === 'projects' && (
        <OrganizationProjectsTab organization={organization} />
      )}
    </div>
  );
}
