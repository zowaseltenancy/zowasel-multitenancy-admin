import OrganizationsListView from "@/features/organization/components/OrganizationsListView";

export default function PendingOrganizationsPage() {
  return (
    <OrganizationsListView
      title="Pending Approval"
      description="Organizations awaiting KYB review before they can be fully approved."
      defaultFilter="pending"
    />
  );
}
