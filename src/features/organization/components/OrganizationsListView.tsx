"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { KybStatus } from "@/types/kyb";
import { GeographicFilterState } from "@/types/geo";
import { Organization } from "@/types/organization";
import { useOrganizations } from "../hooks/useOrganizations";
import OrganizationStatsCards from "./OrganizationStatsCards";
import OrganizationTable from "./OrganizationTable";
import OrganizationFilterToolbar, {
  OrganizationFiltersState,
  INITIAL_ORGANIZATION_FILTERS,
} from "./OrganizationFilterToolbar";

interface Props {
  title: string;
  description: string;
  defaultFilter?: KybStatus | "all";
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  bottomElement?: ReactNode;
  lockStatusFilter?: boolean;
}

export default function OrganizationsListView({
  title,
  description,
  defaultFilter = "all",
  searchValue,
  onSearchChange,
  bottomElement,
  lockStatusFilter = false,
}: Props) {
  const { organizations } = useOrganizations();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeTabStatus, setActiveTabStatus] = useState<KybStatus | "all">(defaultFilter);

  // Table filters state according to qx.docx specifications
  const [filters, setFilters] = useState<OrganizationFiltersState>({
    ...INITIAL_ORGANIZATION_FILTERS,
    status: defaultFilter,
    search: searchValue ?? "",
  });

  const [geoFilter, setGeoFilter] = useState<GeographicFilterState>({
    scope: "global",
    continent: "all",
    subRegion: "all",
    countryCode: "all",
  });

  // Sync external search value if provided
  useEffect(() => {
    if (typeof searchValue === "string") {
      setFilters((prev) => ({ ...prev, search: searchValue }));
    }
  }, [searchValue]);

  // Sync default filter if tab changes
  useEffect(() => {
    setActiveTabStatus(defaultFilter);
    setFilters((prev) => ({ ...prev, status: defaultFilter }));
    setPage(1);
  }, [defaultFilter]);

  // Handler when user updates filters from toolbar
  const handleFilterChange = (newFilters: OrganizationFiltersState) => {
    setFilters(newFilters);
    if (typeof onSearchChange === "function" && newFilters.search !== searchValue) {
      onSearchChange(newFilters.search);
    }
    setPage(1);
  };

  const getModuleCount = (organization: Organization) => {
    return organization.subscriptions.reduce(
      (total, subscription) => total + subscription.activeModules.length,
      0
    );
  };

  // Filter organizations based on all primary & secondary filters
  const filtered = useMemo(() => {
    return organizations.filter((organization) => {
      // 1. Status Filter
      const effectiveStatus = lockStatusFilter ? activeTabStatus : filters.status;
      const matchesStatus =
        effectiveStatus === "all" || organization.kybStatus === effectiveStatus;

      // 2. Plan Filter
      const matchesPlan =
        filters.plan === "all" ||
        organization.subscriptions.some(
          (s) => s.plan.toLowerCase() === filters.plan.toLowerCase()
        );

      // 3. Modules Filter (multi-select)
      const matchesModules =
        filters.modules.length === 0 ||
        organization.subscriptions.some((s) =>
          filters.modules.some((modKey) => s.activeModules.includes(modKey))
        );

      // 4. Region Filter (specific country)
      // 4. Secondary: KYB Status
      const matchesKyb =
        filters.kybStatus === "all" || organization.kybStatus === filters.kybStatus;

      // 5. Secondary: Onboarded By Staff / Agent
      const matchesOnboardedBy =
        filters.onboardedBy === "all" ||
        organization.onboardedByAgent?.id === filters.onboardedBy ||
        organization.assignedStaff?.primary?.id === filters.onboardedBy;

      // 6. Secondary: Organization Type
      const matchesType =
        filters.type === "all" || organization.type === filters.type;

      // 7. Secondary: Module Count
      const modCount = getModuleCount(organization);
      let matchesModCount = true;
      if (filters.moduleCount === "0") {
        matchesModCount = modCount === 0;
      } else if (filters.moduleCount === "1-2") {
        matchesModCount = modCount >= 1 && modCount <= 2;
      } else if (filters.moduleCount === "3+") {
        matchesModCount = modCount >= 3;
      }

      // 8. Search Query
      const query = filters.search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.businessId.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query);

      // 9. Global Geographic Scope (Map Selector)
      const matchesContinent =
        geoFilter.continent === "all" || organization.continent === geoFilter.continent;
      const matchesSubRegion =
        geoFilter.subRegion === "all" || organization.subRegion === geoFilter.subRegion;
      const matchesCountry =
        geoFilter.countryCode === "all" || organization.countryCode === geoFilter.countryCode;

      return (
        matchesStatus &&
        matchesPlan &&
        matchesModules &&
        matchesKyb &&
        matchesOnboardedBy &&
        matchesType &&
        matchesModCount &&
        matchesSearch &&
        matchesContinent &&
        matchesSubRegion &&
        matchesCountry
      );
    });
  }, [organizations, filters, activeTabStatus, lockStatusFilter, geoFilter]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleClearFilters = () => {
    handleFilterChange({
      ...INITIAL_ORGANIZATION_FILTERS,
      status: lockStatusFilter ? activeTabStatus : "all",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Section Grid: Title/Description + Compact Stat Cards on Left; Map Selector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>

          <OrganizationStatsCards
            organizations={organizations}
            activeFilter={activeTabStatus}
            onFilterChange={(value) => {
              setActiveTabStatus(value);
              handleFilterChange({
                ...filters,
                status: value,
              });
            }}
          />
        </div>

        <div className="lg:col-span-5 flex justify-end w-full h-full">
          <CompactRegionScopeSelector
            value={geoFilter}
            onChange={(newFilter) => {
              setGeoFilter(newFilter);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Tabs Row */}
      {bottomElement}

      {/* Dedicated Filter Toolbar (qx.docx Section 1 to 7) */}
      <OrganizationFilterToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        organizations={organizations}
        hideStatusInToolbar={lockStatusFilter}
      />

      {/* Organizations Table */}
      <OrganizationTable
        organizations={paginated}
        onClearFilters={handleClearFilters}
      />

      {/* Result Count Summary & Pagination (qx.docx Section 8 & 9) */}
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
