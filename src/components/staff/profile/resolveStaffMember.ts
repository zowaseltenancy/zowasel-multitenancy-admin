import { StaffMember, StaffRole } from '@/types/staff';

type SystemRole = 'super_admin' | 'admin' | 'staff';

// The API reports the system role in upper snake case (SUPER_ADMIN / ADMIN /
// STAFF); StaffMember.systemRole is the lower-case union the UI compares
// against. Normalising here rather than at each comparison site — StaffListTable
// checks `systemRole === 'super_admin'`, which silently failed for every
// API-sourced record and labelled a super admin as "Admin".
//
// The `status` field a few lines below already lower-cases for the same reason;
// systemRole was simply missed.
function toSystemRole(value: string | null | undefined): SystemRole | undefined {
  switch (value?.toLowerCase()) {
    case 'super_admin': return 'super_admin';
    case 'admin':       return 'admin';
    case 'staff':       return 'staff';
    default:            return undefined;
  }
}

export function resolveStaffMember(
  liveDto: any,
  local: StaffMember | null | undefined,
  roles: StaffRole[]
): StaffMember | null {
  if (liveDto) {
    return {
      ...(local || {}),
      id: liveDto.id,
      firstName: liveDto.firstName || local?.firstName || '',
      lastName: liveDto.lastName || local?.lastName || '',
      email: liveDto.email || local?.email || '',
      phone: liveDto.mobilenumber || liveDto.phone || local?.phone || local?.mobilenumber || '',
      mobilenumber: liveDto.mobilenumber || local?.mobilenumber || '',
      department: liveDto.department?.name || local?.department || 'General',
      departmentId: liveDto.department?.id || local?.departmentId,
      departmentObj: liveDto.department || local?.departmentObj,
      roleId: liveDto.roles?.[0]?.id || local?.roleId || 'role-staff',
      systemRole: toSystemRole(liveDto.role ?? liveDto.systemRole ?? local?.systemRole) ?? 'staff',
      roleIds: liveDto.roles?.map((r: any) => r.id) || local?.roleIds || [],
      roles: liveDto.roles || local?.roles,
      permissions: liveDto.permissions || local?.permissions,
      status: liveDto.status?.toLowerCase() || (liveDto.isActive ? 'active' : 'inactive') || local?.status || 'active',
      statusHistory: liveDto.statusHistory || local?.statusHistory || [
        { status: 'invited', at: liveDto.createdAt || local?.createdAt, reason: 'Staff account invited' },
        { status: 'active', at: liveDto.createdAt || local?.createdAt, reason: 'Staff account active' },
      ],
      manager: liveDto.manager
        ? {
            id: liveDto.manager.id,
            firstName: liveDto.manager.firstName,
            lastName: liveDto.manager.lastName,
          }
        : local?.manager || null,
      country: liveDto.country || local?.country || 'Nigeria',
      employmenttype: liveDto.employmenttype || liveDto.employmentType || local?.employmenttype || local?.employmentType || 'Full-time',
      employmentType: ((liveDto.employmentType || liveDto.employmenttype || local?.employmentType || local?.employmenttype || 'full-time') as string).toLowerCase() as any,
      avatarUrl: liveDto.avatarUrl || local?.avatarUrl,
      dateOfBirth: liveDto.dateOfBirth || local?.dateOfBirth,
      gender: liveDto.gender || local?.gender,
      maritalStatus: liveDto.maritalStatus || local?.maritalStatus,
      nationality: liveDto.nationality || local?.nationality,
      employeeId: liveDto.employeeId || local?.employeeId,
      managerId: liveDto.managerId || local?.managerId,
      workLocation: liveDto.workLocation || local?.workLocation,
      address: liveDto.address || local?.address,
      nextOfKin: liveDto.nextOfKin || local?.nextOfKin,
      education: liveDto.education || local?.education,
      workExperience: liveDto.workExperience || local?.workExperience,
      bank: liveDto.bank || local?.bank,
      bio: liveDto.bio || local?.bio,
      documents: liveDto.documents || local?.documents,
      createdAt: liveDto.createdAt || local?.createdAt,
      updatedAt: liveDto.updatedAt || local?.updatedAt,
    };
  }

  if (local) {
    const sysRole: SystemRole =
      toSystemRole(local.systemRole) ??
      (local.roleId === 'role-super-admin'
        ? 'super_admin'
        : local.roleId === 'role-admin'
        ? 'admin'
        : 'staff');

    const roleObj = roles.find((r) => r.id === local.roleId);
    const resolvedRoles =
      local.roles && local.roles.length > 0
        ? local.roles
        : roleObj
        ? [{ id: roleObj.id, name: roleObj.name, description: roleObj.description }]
        : [{ id: 'role_301', name: 'Regional Lead' }];

    return {
      ...local,
      systemRole: sysRole,
      roles: resolvedRoles,
      permissions:
        local.permissions && local.permissions.length > 0
          ? local.permissions
          : [
              'staff:read',
              'leave:review',
              'organisations:read',
              'departments:read',
              'roles:read',
            ],
      mobilenumber: local.mobilenumber || local.phone || '+234 801 234 5019',
      country: local.country || 'Nigeria',
      employmenttype: local.employmenttype || local.employmentType || 'Full-time',
      departmentObj: local.departmentObj || {
        id: `dept_${(local.department || 'general').toLowerCase().replace(/\s+/g, '_')}`,
        name: local.department || 'General',
      },
      manager: local.manager || {
        id: 'usr_staff_02',
        firstName: 'Ngozi',
        lastName: 'Umeh',
      },
      statusHistory:
        local.statusHistory && local.statusHistory.length > 0
          ? local.statusHistory
          : [
              {
                status: 'invited',
                at: local.createdAt || local.dateJoined || '2025-11-01T08:00:00Z',
                reason: 'Initial staff invitation dispatched',
              },
              {
                status: local.status || 'active',
                at: local.createdAt || local.dateJoined || '2025-11-03T08:00:00Z',
                reason: 'Staff member onboarding completed',
              },
            ],
    };
  }

  return null;
}