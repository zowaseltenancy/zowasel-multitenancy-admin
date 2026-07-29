'use client';

import OrganizationSearchBar from '@/features/organization/components/OrganizationSearchBar';
import OrganizationTabs from '@/features/organization/components/OrganizationTabs';
import OrganizationsListView from '@/features/organization/components/OrganizationsListView';
import { useState } from 'react';

export default function AllOrganizationsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <OrganizationsListView
        title="All Organizations"
        description="Every business tenant registered on the platform, regardless of KYB status."
        defaultFilter="all"
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
