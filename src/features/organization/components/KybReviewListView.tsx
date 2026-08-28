"use client";

import { useMemo, useState } from "react";

import { KybStatus } from "@/types/kyb";
import { Card } from "@/components/ui/card";
import { useOrganizations } from "../hooks/useOrganizations";
import Pagination from "@/components/shared/Pagination";

import OrganizationSearchBar from "./OrganizationSearchBar";
import KybTable from "./KybTable";

const PAGE_SIZE = 5;

interface Props {
  title: string;

  description: string;

  defaultFilter?: KybStatus | "all";
}

export default function KybReviewListView({
  title,
  description,
  defaultFilter = "all",
}: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Both filters go to the API rather than being applied to a fetched page.
  // Client-side filtering only ever saw the first 100 businesses, so a platform
  // with more than that silently dropped records from these queues.
  //
  // kybStatus is upper case in the database and lower case in the response, so
  // the filter value has to be converted back on the way out.
  const { organizations, isLoading, error } = useOrganizations({
    page: 1,
    limit: 100,
    sortBy: "kybSubmittedAt",
    sortOrder: "desc",
    ...(defaultFilter !== "all" ? { kybStatus: defaultFilter.toUpperCase() } : {}),
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  const filtered = useMemo(() => organizations, [organizations]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const paginatedOrganizations = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, page]);

  if (isLoading) {
    return (
      <Card className="flex min-h-[240px] items-center justify-center p-6 text-sm text-muted-foreground">
        Loading KYB queue…
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm font-medium text-foreground">Unable to load the KYB queue</p>
        <p className="max-w-md text-xs text-muted-foreground">{error}</p>
      </Card>
    );
  }

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

      <KybTable organizations={paginatedOrganizations} />

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </div>
  );
}
