"use client";

import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import OrganizationTable from "@/features/organization/components/OrganizationTable";

export default function CooperativeOrganizationsPage() {
  const { organizations } = useOrganizations();

  const cooperatives = organizations.filter(
    (organization) =>
      organization.type === "cooperative"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Cooperatives
        </h1>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Organizations registered as farmer cooperatives rather than single-owner businesses.
        </p>
      </div>

      <OrganizationTable
        organizations={cooperatives}
      />
    </div>
  );
}
