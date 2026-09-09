'use client';

import { StaffMember, StaffRole } from '@/types/staff';
import { StaffLeaveDialog } from './actions/StaffLeaveDialog';
import { StaffRoleDialog, StaffDepartmentDialog } from './actions/StaffRoleDeptDialogs';

interface Props {
  staff: StaffMember;
  roles: StaffRole[];
  departments: string[];
  onSuccess: () => void;
}

export function StaffActions({ staff, roles, departments, onSuccess }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
      <StaffRoleDialog staff={staff} roles={roles} onSuccess={onSuccess} />
      <StaffDepartmentDialog staff={staff} departments={departments} onSuccess={onSuccess} />
      <StaffLeaveDialog />
    </div>
  );
}