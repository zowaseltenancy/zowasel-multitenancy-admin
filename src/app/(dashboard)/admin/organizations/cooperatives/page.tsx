"use client";

import { useMemo, useState } from "react";

import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import OrganizationTable from "@/features/organization/components/OrganizationTable";
import OrganizationSearchBar from "@/features/organization/components/OrganizationSearchBar";
import Pagination from "@/components/shared/Pagination";

const PAGE_SIZE = 5;

export default function CooperativeOrganizationsPage() {
  const { organizations } = useOrganizations();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const cooperatives = useMemo(() => {
    return organizations.filter((organization) => {
      const isCoop = organization.type === "cooperative";
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query);

      return isCoop && matchesSearch;
    });
  }, [organizations, search]);

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Cooperatives
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Organizations registered as farmer cooperatives rather than single-owner businesses.
          </p>
        </div>

        <OrganizationSearchBar
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <OrganizationTable
        organizations={paginated}
      />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
