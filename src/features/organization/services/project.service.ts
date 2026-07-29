import {
  getOrganizationProjectById,
  getOrganizationProjects,
} from '../data/mockOrganizationProjects';

export const projectService = {
  getProjectsByOrganization(organizationId: string) {
    return getOrganizationProjects(organizationId);
  },

  getProjectById(organizationId: string, projectId: string) {
    return getOrganizationProjectById(organizationId, projectId);
  },
};
