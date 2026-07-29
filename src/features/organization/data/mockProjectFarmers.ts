export interface OrganizationProjectFarmer {
  id: string;
  projectId: string;
  firstName: string;
  lastName: string;
  village: string;
  status: 'active' | 'inactive' | 'pending';
  lastVisit: string;
}

const mockProjectFarmers: OrganizationProjectFarmer[] = [
  {
    id: 'farmer_001',
    projectId: 'proj_001',
    firstName: 'Amina',
    lastName: 'Kano',
    village: 'Oke-Are',
    status: 'active',
    lastVisit: '2026-07-25',
  },
  {
    id: 'farmer_002',
    projectId: 'proj_001',
    firstName: 'Emeka',
    lastName: 'Ifeanyi',
    village: 'Oyo Village',
    status: 'active',
    lastVisit: '2026-07-26',
  },
  {
    id: 'farmer_003',
    projectId: 'proj_001',
    firstName: 'Grace',
    lastName: 'Nwosu',
    village: 'Iyaganku',
    status: 'active',
    lastVisit: '2026-07-24',
  },
  {
    id: 'farmer_004',
    projectId: 'proj_002',
    firstName: 'Habib',
    lastName: 'Abubakar',
    village: 'Dala',
    status: 'active',
    lastVisit: '2026-07-27',
  },
  {
    id: 'farmer_005',
    projectId: 'proj_002',
    firstName: 'Chioma',
    lastName: 'Eze',
    village: 'Sabon Gari',
    status: 'active',
    lastVisit: '2026-07-26',
  },
  {
    id: 'farmer_006',
    projectId: 'proj_003',
    firstName: 'Kofi',
    lastName: 'Aduba',
    village: 'Wudil',
    status: 'pending',
    lastVisit: '2026-07-20',
  },
  {
    id: 'farmer_007',
    projectId: 'proj_004',
    firstName: 'Mary',
    lastName: 'Sule',
    village: 'Kachia',
    status: 'active',
    lastVisit: '2026-07-22',
  },
  {
    id: 'farmer_008',
    projectId: 'proj_005',
    firstName: 'Olu',
    lastName: 'Adewale',
    village: 'Ijebu',
    status: 'inactive',
    lastVisit: '2026-07-15',
  },
];

export function getProjectFarmers(projectId: string) {
  return mockProjectFarmers.filter((farmer) => farmer.projectId === projectId);
}
