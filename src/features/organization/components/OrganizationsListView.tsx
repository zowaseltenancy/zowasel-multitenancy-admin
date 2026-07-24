"use client";

import { useState } from "react";

import { KybStatus } from "@/types/kyb";
import { useOrganizations } from "../hooks/useOrganizations";

import OrganizationStatsCards from "./OrganizationStatsCards";
import OrganizationSearchBar from "./OrganizationSearchBar";
import OrganizationTable from "./OrganizationTable";
import KybFilterTabs from "@/components/shared/KybFilterTabs";

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

  const [filter, setFilter] = useState<
    KybStatus | "all"
  >(defaultFilter);

  const [search, setSearch] = useState("");

  const filtered = organizations.filter(
    (organization) => {
      const matchesFilter =
        filter === "all" ||
        organization.kybStatus === filter;

      const query = search.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        organization.name
          .toLowerCase()
          .includes(query) ||
        organization.owner.email
          .toLowerCase()
          .includes(query) ||
        organization.owner.name
          .toLowerCase()
          .includes(query);

      return matchesFilter && matchesSearch;
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          {description}
        </p>
      </div>

      <OrganizationStatsCards
        organizations={organizations}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <KybFilterTabs
          value={filter}
          onChange={setFilter}
        />

        <OrganizationSearchBar
          value={search}
          onChange={setSearch}
        />
      </div>

      <OrganizationTable
        organizations={filtered}
      />
    </div>
  );
}
