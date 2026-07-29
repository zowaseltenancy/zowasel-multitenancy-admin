export type OrganizationProjectStatus =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'completed';

export interface OrganizationProject {
  id: string;
  organizationId: string;
  name: string;
  location: string;
  cropFocus: string;
  status: OrganizationProjectStatus;
  agents: number;
  farmers: number;
  startDate: string;
  endDate: string | null;
  description: string;
}

export const mockOrganizationProjects: OrganizationProject[] = [
  {
    id: 'proj_001',
    organizationId: 'biz_1001',
    name: 'Oyo Cassava Outgrower Scheme',
    location: 'Oyo State, Nigeria',
    cropFocus: 'Cassava',
    status: 'active',
    agents: 8,
    farmers: 320,
    startDate: '2025-10-01',
    endDate: '2026-09-30',
    description:
      'A large-scale cassava outgrower program focused on improving productivity through input financing, field advisory, and market linkages.',
  },
  {
    id: 'proj_002',
    organizationId: 'biz_1001',
    name: 'Agro Data Capture Pilot',
    location: 'Ibadan, Oyo State',
    cropFocus: 'Cassava',
    status: 'active',
    agents: 5,
    farmers: 120,
    startDate: '2026-01-15',
    endDate: '2026-12-31',
    description:
      'A pilot project capturing farm registration data, input use, and yield estimates for Cassava growers across the cooperative network.',
  },
  {
    id: 'proj_003',
    organizationId: 'biz_1002',
    name: 'Kano Rice Value Chain',
    location: 'Kano State, Nigeria',
    cropFocus: 'Rice',
    status: 'active',
    agents: 5,
    farmers: 210,
    startDate: '2026-03-01',
    endDate: '2026-11-30',
    description:
      'Rice production and aggregation program supporting smallholder farmers with field-level reporting, logistics, and marketplace access.',
  },
  {
    id: 'proj_004',
    organizationId: 'biz_1005',
    name: 'Kaduna Maize Expansion Program',
    location: 'Kaduna State, Nigeria',
    cropFocus: 'Maize',
    status: 'active',
    agents: 6,
    farmers: 180,
    startDate: '2026-02-01',
    endDate: '2026-10-15',
    description:
      'Maize expansion project that includes nutrient management recommendations, yield monitoring, and input financing support.',
  },
  {
    id: 'proj_005',
    organizationId: 'biz_1006',
    name: 'Riverbend Poultry & Grain Program',
    location: 'Ogun State, Nigeria',
    cropFocus: 'Poultry Feed & Grains',
    status: 'pending',
    agents: 2,
    farmers: 40,
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    description:
      'A combined poultry and grain value chain project designed for cooperative members to improve feed supply and grain processing.',
  },
];

export function getOrganizationProjects(
  organizationId: string
): OrganizationProject[] {
  return mockOrganizationProjects.filter(
    (project) => project.organizationId === organizationId
  );
}

export function getOrganizationProjectById(
  organizationId: string,
  projectId: string
): OrganizationProject | undefined {
  return mockOrganizationProjects.find(
    (project) =>
      project.organizationId === organizationId && project.id === projectId
  );
}
