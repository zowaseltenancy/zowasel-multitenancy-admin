import { notFound } from 'next/navigation';

import OrganizationDetailView from '@/features/organization/components/OrganizationDetailView';
import { organizationService } from '@/features/organization/services/organization.service';

interface Props {
  params: Promise<{
    moduleId: string;
    organizationId: string;
  }>;
}

export default async function ModuleOrganizationDetailPage({ params }: Props) {
  const { moduleId, organizationId } = await params;
  const organization = organizationService.getOrganizationById(organizationId);

  if (!organization) {
    notFound();
  }

  return (
    <OrganizationDetailView
      organizationId={organizationId}
      moduleId={moduleId}
    />
  );
}
