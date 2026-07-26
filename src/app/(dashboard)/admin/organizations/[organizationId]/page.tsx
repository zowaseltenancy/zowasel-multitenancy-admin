import { notFound } from "next/navigation";

import { organizationService } from "@/features/organization/services/organization.service";
import OrganizationDetailView from "@/features/organization/components/OrganizationDetailView";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

export default async function OrganizationDetailPage({
  params,
}: Props) {
  const { organizationId } = await params;

  const organization =
    organizationService.getOrganizationById(
      organizationId
    );

  if (!organization) {
    notFound();
  }

  return (
    <OrganizationDetailView
      organizationId={organizationId}
    />
  );
}
