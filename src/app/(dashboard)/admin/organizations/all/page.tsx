"use client";

import OrganizationTabs from "@/features/organization/components/OrganizationTabs";
import OrganizationsListView from "@/features/organization/components/OrganizationsListView";

export default function AllOrganizationsPage() {
  return (
    <div className="space-y-6">
      <OrganizationsListView
        title="All Organizations"
        description="Every business tenant registered on the platform, regardless of KYB status."
        defaultFilter="all"
        bottomElement={<OrganizationTabs />}
      />
    </div>
  );
}
