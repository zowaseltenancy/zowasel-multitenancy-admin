import { notFound } from 'next/navigation';

import OrganizationProjectDetailView from '@/features/organization/components/OrganizationProjectDetailView';
import { getProjectFarmers } from '@/features/organization/data/mockProjectFarmers';
import { organizationService } from '@/features/organization/services/organization.service';
import { projectService } from '@/features/organization/services/project.service';

interface Props {
  params: Promise<{
    organizationId: string;
    projectId: string;
  }>;
}

export default async function OrganizationProjectPage({ params }: Props) {
  const { organizationId, projectId } = await params;
  const organization = organizationService.getOrganizationById(organizationId);

  if (!organization) {
    notFound();
  }

  const project = projectService.getProjectById(organizationId, projectId);

  if (!project) {
    notFound();
  }

  const farmers = getProjectFarmers(projectId);

  return (
    <OrganizationProjectDetailView
      organization={organization}
      project={project}
      farmers={farmers}
    />
  );
}
