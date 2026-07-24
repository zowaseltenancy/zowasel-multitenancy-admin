import OrganizationsListView from "@/features/organization/components/OrganizationsListView";

export default function AllOrganizationsPage() {
  return (
    <OrganizationsListView
      title="All Organizations"
      description="Every business tenant registered on the platform, regardless of KYB status."
      defaultFilter="all"
    />
  );
}
