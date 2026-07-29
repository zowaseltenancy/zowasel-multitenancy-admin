'use client';

import OrganizationSearchBar from '@/features/organization/components/OrganizationSearchBar';
import OrganizationTabs from '@/features/organization/components/OrganizationTabs';
import OrganizationsListView from '@/features/organization/components/OrganizationsListView';
import { useState } from 'react';

export default function PendingOrganizationsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <OrganizationsListView
        title="Pending Approval"
        description="Organizations awaiting KYB review before they can be fully approved."
        defaultFilter="pending"
        searchValue={search}
        onSearchChange={setSearch}
        bottomElement={
          <OrganizationTabs
            rightElement={
              <OrganizationSearchBar
                value={search}
                onChange={(value) => setSearch(value)}
              />
            }
          />
        }
      />
    </div>
  );
}
