"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import Pagination from "@/components/shared/Pagination";
import CompactRegionScopeSelector from "@/components/shared/CompactRegionScopeSelector";
import { KybStatus } from "@/types/kyb";
import { GeographicFilterState } from "@/types/geo";
import { useStaff } from "@/features/staff/hooks/useStaff";
import { useOrganizations, useOrganizationStats } from "../hooks/useOrganizations";
import { BusinessListQuery } from "../api/organization.types";
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

  // Search is now a server-side filter, so the raw input is debounced — without
  // this every keystroke is a request, and the responses can land out of order.
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handler when user updates filters from toolbar
  const handleFilterChange = (newFilters: OrganizationFiltersState) => {
    setFilters(newFilters);
    if (typeof onSearchChange === "function" && newFilters.search !== searchValue) {
      onSearchChange(newFilters.search);
    }
    setPage(1);
  };

  // Every filter in the toolbar now maps to a query parameter.
  //
  // Previously all of this ran in the browser over one fetched page, which is
  // why the "More Filters" panel appeared to do nothing: type/onboardedBy/
  // moduleCount were compared against fields the list projection either
  // normalises away (Tenant.type is free-form and was collapsed to "merchant"
  // by the mapper) or does not populate for every row. Filtering a single page
  // also can't find a match that lives on page two.
  const query = useMemo<BusinessListQuery>(() => {
    const effectiveStatus = lockStatusFilter ? activeTabStatus : filters.status;

    return {
      page,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
      // The API's enum is upper-case; the UI's is lower-case.
      ...(effectiveStatus !== "all" ? { kybStatus: effectiveStatus.toUpperCase() } : {}),
      ...(filters.plan !== "all" ? { plan: filters.plan } : {}),
      ...(filters.type !== "all" ? { type: filters.type } : {}),
      ...(filters.onboardedBy !== "all" ? { onboardedById: filters.onboardedBy } : {}),
      ...(filters.modules.length > 0 ? { modules: filters.modules } : {}),
      ...(filters.moduleCount !== "all" ? { moduleCount: filters.moduleCount } : {}),
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      // The map selector. continent/subRegion/country compose server-side —
      // Africa plus Western Africa is an intersection, not a contradiction.
      ...(geoFilter.continent !== "all" ? { continent: geoFilter.continent } : {}),
      ...(geoFilter.subRegion !== "all" ? { subRegion: geoFilter.subRegion } : {}),
      ...(geoFilter.countryCode !== "all" ? { country: geoFilter.countryCode } : {}),
    };
  }, [
    page,
    pageSize,
    filters,
    debouncedSearch,
    activeTabStatus,
    lockStatusFilter,
    geoFilter,
  ]);

  const { organizations, meta, isLoading, isFetching } = useOrganizations(query);

  // Platform-wide counts for the tiles. Counting the fetched rows would make
  // "Total" mean "rows on this page" and every tile move as you filter or page.
  const { stats } = useOrganizationStats();
  const counts = stats
    ? {
        total: stats.total,
        approved: stats.kyb.APPROVED,
        pending: stats.kyb.PENDING,
        rejected: stats.kyb.REJECTED,
      }
    : undefined;

  // The "Onboarded By" choices come from the staff directory rather than from
  // the rows on screen — a paginated page only contains a handful of them.
  const { staff } = useStaff({ limit: 100 });
  const staffOptions = useMemo(
    () =>
      staff.map((member) => ({
        id: member.id,
        label:
          [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email,
      })),
    [staff],
  );

  const totalItems = meta?.total ?? organizations.length;
  const pageCount = Math.max(1, meta?.totalPages ?? 1);

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
            counts={counts}
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
        staffOptions={staffOptions}
        hideStatusInToolbar={lockStatusFilter}
      />

      {/* Organizations Table */}
      <OrganizationTable
        organizations={organizations}
        isLoading={isLoading || isFetching}
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
