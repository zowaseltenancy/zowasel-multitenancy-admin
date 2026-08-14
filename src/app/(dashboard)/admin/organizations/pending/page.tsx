"use client";

import OrganizationTabs from "@/features/organization/components/OrganizationTabs";
import OrganizationsListView from "@/features/organization/components/OrganizationsListView";

export default function PendingOrganizationsPage() {
  return (
    <div className="space-y-6">
      <OrganizationsListView
        title="Pending Approval"
        description="Organizations awaiting KYB review before they can be fully approved."
        defaultFilter="pending"
        lockStatusFilter={true}
        bottomElement={<OrganizationTabs />}
      />
    </div>
  );
}
