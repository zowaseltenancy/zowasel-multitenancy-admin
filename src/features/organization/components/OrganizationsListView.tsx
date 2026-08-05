'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import CompactRegionScopeSelector from '@/components/shared/CompactRegionScopeSelector';
import { KybStatus } from '@/types/kyb';
import { GeographicFilterState } from '@/types/geo';
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

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  const isExternalSearch = typeof onSearchChange === 'function';
  const effectiveSearch = isExternalSearch ? (searchValue ?? '') : search;

  useEffect(() => {
    // Resets pagination when an externally-owned search value changes (the
    // internal filter controls already reset page on their own onChange).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [effectiveSearch, activeFilter, geoFilter]);

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

      // Geographic region filtering
      const matchesContinent =
        geoFilter.continent === "all" || organization.continent === geoFilter.continent;
      const matchesSubRegion =
        geoFilter.subRegion === "all" || organization.subRegion === geoFilter.subRegion;
      const matchesCountry =
        geoFilter.countryCode === "all" || organization.countryCode === geoFilter.countryCode;

      return matchesFilter && matchesSearch && matchesContinent && matchesSubRegion && matchesCountry;
    });
  }, [organizations, activeFilter, effectiveSearch, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Left side has Title/Description + OrganizationStatsCards; Right side has Map Selector at top right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between h-full space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>

          <OrganizationStatsCards
            organizations={organizations}
            activeFilter={activeFilter}
            onFilterChange={(value) => {
              setActiveFilter(value);
              setPage(1);
            }}
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newFilter) => {
              setGeoFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </div>

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
