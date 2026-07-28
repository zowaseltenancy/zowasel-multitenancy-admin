"use client";

import { useMemo, useState } from "react";

import { KybStatus } from "@/types/kyb";
import { useOrganizations } from "../hooks/useOrganizations";
import Pagination from "@/components/shared/Pagination";

import OrganizationSearchBar from "./OrganizationSearchBar";
import OrganizationTable from "./OrganizationTable";

const PAGE_SIZE = 5;

interface Props {
  title: string;

  description: string;

  defaultFilter?: KybStatus | "all";
}

export default function OrganizationsListView({
  title,
  description,
  defaultFilter = "all",
}: Props) {
  const { organizations } = useOrganizations();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return organizations.filter((organization) => {
      const matchesFilter =
        defaultFilter === "all" ||
        organization.kybStatus === defaultFilter;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [organizations, defaultFilter, search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedOrganizations = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            {description}
          </p>
        </div>

        <OrganizationSearchBar
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <OrganizationTable
        organizations={paginatedOrganizations}
      />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
