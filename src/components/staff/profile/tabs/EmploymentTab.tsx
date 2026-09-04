'use client';

import { StaffMember, DepartmentRole } from '@/types/staff';
import { PlacementSection } from './employment/PlacementSection';
import { ProjectsAndHistorySection } from './employment/ProjectsAndHistorySection';
import { DepartmentRolesSection } from './employment/DepartmentRolesSection';

interface EmploymentTabProps {
  staff: StaffMember;
  roleName: string;
  departmentRoles?: DepartmentRole[];
}

export function EmploymentTab({ staff, roleName, departmentRoles = [] }: EmploymentTabProps) {
  return (
    <div className="border border-border/60 rounded-2xl bg-card overflow-hidden shadow-2xs divide-y divide-border/60">
      <PlacementSection staff={staff} roleName={roleName} />
      <ProjectsAndHistorySection staff={staff} />
      <DepartmentRolesSection departmentRoles={departmentRoles} />
    </div>
  );
}
