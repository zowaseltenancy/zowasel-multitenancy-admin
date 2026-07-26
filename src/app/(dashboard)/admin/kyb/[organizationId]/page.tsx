import { notFound } from "next/navigation";

import { organizationService } from "@/features/organization/services/organization.service";
import KybDetailView from "@/features/organization/components/KybDetailView";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

export default async function KybDetailPage({
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
    <KybDetailView
      organizationId={organizationId}
    />
  );
}
