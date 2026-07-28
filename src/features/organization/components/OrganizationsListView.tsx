"use client";

import { useMemo, useState } from "react";

import { KybStatus } from "@/types/kyb";
import { useOrganizations } from "../hooks/useOrganizations";
import OrganizationSearchBar from "./OrganizationSearchBar";
import OrganizationTable from "./OrganizationTable";
import Pagination from "@/components/shared/Pagination";

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
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return organizations.filter((organization) => {
      const matchesFilter =
        defaultFilter === "all" || organization.kybStatus === defaultFilter;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        organization.name.toLowerCase().includes(query) ||
        organization.owner.email.toLowerCase().includes(query) ||
        organization.owner.name.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [organizations, defaultFilter, search]);

  const totalItems = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        </div>

        <OrganizationSearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
      </div>

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
