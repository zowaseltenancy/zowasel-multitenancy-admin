'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import { KybStatus } from '@/types/kyb';
import { useOrganizations } from '../hooks/useOrganizations';
import OrganizationSearchBar from './OrganizationSearchBar';
import OrganizationStatsCards from './OrganizationStatsCards';
import OrganizationTable from './OrganizationTable';

interface Props {
  title: string;
  description: string;
  defaultFilter?: KybStatus | 'all';
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  bottomElement?: ReactNode;
}

export default function OrganizationsListView({
  title,
  description,
  defaultFilter = 'all',
  searchValue,
  onSearchChange,
  bottomElement,
}: Props) {
  const { organizations } = useOrganizations();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeFilter, setActiveFilter] = useState<KybStatus | 'all'>(
    defaultFilter
  );

  const isExternalSearch = typeof onSearchChange === 'function';
  const effectiveSearch = isExternalSearch ? (searchValue ?? '') : search;

  useEffect(() => {
    setPage(1);
  }, [effectiveSearch, activeFilter]);

  const filtered = useMemo(() => {
    return organizations.filter((organization) => {
      const matchesFilter =
        activeFilter === 'all' || organization.kybStatus === activeFilter;

      const query = effectiveSearch.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [organizations, activeFilter, effectiveSearch]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <OrganizationStatsCards
        organizations={organizations}
        activeFilter={activeFilter}
        onFilterChange={(value) => {
          setActiveFilter(value);
          setPage(1);
        }}
      />

      {bottomElement}

      {!isExternalSearch ? (
        <OrganizationSearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
      ) : null}

      <OrganizationTable organizations={paginated} />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        totalItems={totalItems}
        pageSizeOptions={[5, 10, 15, 20]}
      />
    </div>
  );
}
