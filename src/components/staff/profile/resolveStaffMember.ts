import { StaffMember, StaffRole } from '@/types/staff';

export function resolveStaffMember(
  liveDto: any,
  local: StaffMember | null | undefined,
  roles: StaffRole[]
): StaffMember | null {
  if (liveDto) {
    return {
      id: liveDto.id,
      firstName: liveDto.firstName || '',
      lastName: liveDto.lastName || '',
      email: liveDto.email,
      phone: liveDto.mobilenumber || '',
      mobilenumber: liveDto.mobilenumber || '',
      department: liveDto.department?.name || 'General',
      departmentId: liveDto.department?.id,
      departmentObj: liveDto.department,
      roleId: liveDto.roles?.[0]?.id || 'role-staff',
      systemRole: liveDto.role || liveDto.systemRole || 'STAFF',
      roleIds: liveDto.roles?.map((r: any) => r.id) || [],
      roles: liveDto.roles,
      permissions: liveDto.permissions,
      status: liveDto.status?.toLowerCase() || (liveDto.isActive ? 'active' : 'inactive'),
      statusHistory: liveDto.statusHistory || [
        { status: 'invited', at: liveDto.createdAt, reason: 'Staff account invited' },
        { status: 'active', at: liveDto.createdAt, reason: 'Staff account active' },
      ],
      manager: liveDto.manager
        ? {
            id: liveDto.manager.id,
            firstName: liveDto.manager.firstName,
            lastName: liveDto.manager.lastName,
          }
        : null,
      country: liveDto.country || 'Nigeria',
      employmenttype: liveDto.employmenttype || 'Full-time',
      createdAt: liveDto.createdAt,
      updatedAt: liveDto.updatedAt,
    };
  }

  if (local) {
    const sysRole =
      local.systemRole ||
      (local.roleId === 'role-super-admin'
        ? 'SUPER_ADMIN'
        : local.roleId === 'role-admin'
        ? 'ADMIN'
        : 'STAFF');

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