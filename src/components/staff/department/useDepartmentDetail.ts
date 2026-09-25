'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  useAdminRoles,
  useDepartment,
  useDepartments,
  useStaff,
} from '@/features/staff/hooks/useStaff';
import {
  mapAdminRole,
  mapDepartment,
  mapDepartmentRole,
  mapStaff,
} from '@/features/staff/api/staff.mappers';
import { Department, DepartmentHead, DepartmentRole, StaffMember, StaffRole } from '@/types/staff';

// One department, backed by GET /admin/departments/{id}.
//
// The route parameter is normally the uuid, but the previous version also
// resolved a slugged name ("regional-operations") by scanning the whole local
// store. That is preserved — links of that shape may exist — by looking the
// name up against the department list, which is a bounded query rather than a
// full-store scan.
//
// Members come from GET /admin/staff?departmentId=, so the list is the server's
// and is searchable server-side rather than filtered out of one page.
export function useDepartmentDetail(rawParam?: string | string[]) {
  const rawId = Array.isArray(rawParam) ? rawParam[0] : rawParam;
  const isUuid = Boolean(
    rawId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId),
  );

  // Only fetched when the parameter is not already an id — this is the
  // slug/name fallback path.
  const { departments: allDepartments } = useDepartments(isUuid ? { limit: 1 } : { limit: 100 });

  const resolvedId = useMemo(() => {
    if (!rawId) return '';
    if (isUuid) return rawId;

    const decoded = decodeURIComponent(rawId).toLowerCase().trim();
    const match = allDepartments.find(
      (d) =>
        d.name.toLowerCase() === decoded ||
        d.name.toLowerCase().replace(/\s+/g, '-') === decoded,
    );
    return match?.id ?? '';
  }, [rawId, isUuid, allDepartments]);

  const detailQuery = useDepartment(resolvedId);

  const [memberSearch, setMemberSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(memberSearch), 300);
    return () => clearTimeout(timer);
  }, [memberSearch]);

  const { staff: memberDtos } = useStaff(
    resolvedId
      ? {
          departmentId: resolvedId,
          limit: 100,
          ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        }
      : { limit: 1 },
  );

  // Roles scoped to this department. The API has one role table; a role belongs
  // to a department exactly when it carries that departmentId.
  const { roles: departmentRoleDtos, create, update, remove } = useAdminRoles(
    resolvedId ? { departmentId: resolvedId, limit: 100 } : { limit: 1 },
  );

  // The full catalogue, for the role builder's picker.
  const { roles: allRoleDtos } = useAdminRoles({ limit: 100 });

  const dept: Department | null = detailQuery.data ? mapDepartment(detailQuery.data) : null;

  const head: DepartmentHead | null = detailQuery.data?.head
    ? {
        id: detailQuery.data.head.id,
        firstName: detailQuery.data.head.firstName ?? '',
        lastName: detailQuery.data.head.lastName ?? '',
        email: detailQuery.data.head.email,
      }
    : null;

  const members = useMemo<StaffMember[]>(() => memberDtos.map(mapStaff), [memberDtos]);

  const roles = useMemo<DepartmentRole[]>(
    () => departmentRoleDtos.map((dto) => mapDepartmentRole(dto, resolvedId)),
    [departmentRoleDtos, resolvedId],
  );

  const allRoles = useMemo<StaffRole[]>(() => allRoleDtos.map(mapAdminRole), [allRoleDtos]);

  // POST/PATCH /admin/roles with this department's id, so a role created here
  // is department-scoped. Permissions are a separate PUT, applied after the
  // role exists.
  const handleRoleSave = (role: DepartmentRole, editingRole: DepartmentRole | null) => {
    const fields = {
      name: role.name,
      description: role.description ?? '',
      departmentId: resolvedId,
    };

    if (editingRole) {
      update(editingRole.id, fields);
      return;
    }
    create(fields);
  };

  const deleteRole = (roleId: string) => {
    // The API refuses while admins still hold the role, and says how many.
    remove(roleId);
  };

  return {
    // Kept for the page's loading gate.
    mounted: !detailQuery.isLoading,
    isLoading: detailQuery.isLoading,
    // A slug that matches no department resolves to '', so the detail query
    // never runs — that is a 404, not a loading state.
    notFound: Boolean(rawId) && !isUuid && !resolvedId && allDepartments.length > 0,
    dept,
    head,
    members,
    roles,
    allRoles,
    // The server applied the search.
    filteredMembers: members,
    memberSearch,
    setMemberSearch,
    handleRoleSave,
    deleteRole,
    // Mutations invalidate the department queries themselves, so there is
    // nothing left to refresh by hand.
    refreshDept: () => {},
  };
}
