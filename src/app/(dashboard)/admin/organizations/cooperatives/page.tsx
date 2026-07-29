'use client';

import { useMemo, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import OrganizationSearchBar from '@/features/organization/components/OrganizationSearchBar';
import OrganizationStatsCards from '@/features/organization/components/OrganizationStatsCards';
import OrganizationTable from '@/features/organization/components/OrganizationTable';
import OrganizationTabs from '@/features/organization/components/OrganizationTabs';
import { useOrganizations } from '@/features/organization/hooks/useOrganizations';
import { KybStatus } from '@/types/kyb';

const PAGE_SIZE = 5;

export default function CooperativeOrganizationsPage() {
  const { organizations } = useOrganizations();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [activeFilter, setActiveFilter] = useState<KybStatus | 'all'>('all');

  const cooperatives = useMemo(() => {
    return organizations.filter((organization) => {
      const isCoop = organization.type === 'cooperative';
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === 'all' || organization.kybStatus === activeFilter;

      return isCoop && matchesSearch && matchesFilter;
    });
  }, [organizations, search, activeFilter]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const pageCount = Math.ceil(cooperatives.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return cooperatives.slice(startIndex, startIndex + PAGE_SIZE);
  }, [cooperatives, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cooperatives</h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Organizations registered as farmer cooperatives rather than
          single-owner businesses.
        </p>
      </div>

      <OrganizationStatsCards
        organizations={organizations.filter(
          (organization) => organization.type === 'cooperative'
        )}
        activeFilter={activeFilter}
        onFilterChange={(value) => {
          setActiveFilter(value);
          setPage(1);
        }}
      />

      <OrganizationTabs
        rightElement={
          <OrganizationSearchBar value={search} onChange={handleSearchChange} />
        }
      />

      <OrganizationTable organizations={paginated} />

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
