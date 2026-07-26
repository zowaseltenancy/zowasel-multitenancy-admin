"use client";

import { useState } from "react";

import { KybStatus } from "@/types/kyb";
import { useOrganizations } from "../hooks/useOrganizations";

import OrganizationSearchBar from "./OrganizationSearchBar";
import OrganizationTable from "./OrganizationTable";

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

  const filtered = organizations.filter(
    (organization) => {
      const matchesFilter =
        defaultFilter === "all" ||
        organization.kybStatus === defaultFilter;

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
          onChange={setSearch}
        />
      </div>

      <OrganizationTable
        organizations={filtered}
      />
    </div>
  );
}
