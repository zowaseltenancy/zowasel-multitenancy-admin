import { notFound } from "next/navigation";
import KybDocumentViewer from "@/features/organization/components/KybDocumentViewer";
import { mockOrganizations } from "@/features/organization/data/mockOrganizations";

interface Props {
  params: Promise<{
    organizationId: string;
  }>;
}

export default async function KybDocumentsPage({ params }: Props) {
  const { organizationId } = await params;
  const organization = mockOrganizations.find(
    (org) => org.id === organizationId || org.businessId === organizationId
  );

  if (!organization) {
    notFound();
  }

  return <KybDocumentViewer organization={organization} />;
}
