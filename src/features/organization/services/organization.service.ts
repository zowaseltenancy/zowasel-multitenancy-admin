import { mockOrganizations } from "../data/mockOrganizations";
import { Organization } from "@/types/organization";

export const organizationService = {
  getOrganizations(): Organization[] {
    return mockOrganizations;
  },

  getOrganizationById(
    id: string
  ): Organization | undefined {
    return mockOrganizations.find(
      (organization) => organization.id === id
    );
  },
};
