import { useMemo, useState } from 'react';
import { useAdminRoles, useDepartments, useStaff } from '@/features/staff/hooks/useStaff';
import { mapAdminRole, mapStaff } from '@/features/staff/api/staff.mappers';
import { StaffRole, StaffMember } from '@/types/staff';
import { ALL_PERMISSIONS } from '@/constants/permissions';
import { TabView } from './RolesTabBar';

// Backed by /admin/roles. This page previously read repo.getRoles() out of a
// localStorage store seeded from mockRoles, and every create/edit/delete was a
// local array edit — so two admins saw different roles and a refresh undid the
// lot.
//
// Two behaviours changed as a result, both because the server is now the
// authority:
//
//   * Deleting a role is refused when admins still hold it (the API's guard),
//     rather than when the role carries a client-side isSystemRole flag. That
//     flag does not exist server-side.
//   * Toggling a permission in the matrix issues PUT /admin/roles/{id}/
//     permissions with the role's full resulting set, because the endpoint
//     replaces the set rather than accepting a delta.
const ROLE_PAGE_SIZE = 100;

export function useRolesPage() {
  const {
    roles: roleDtos,
    isLoading,
    error,
    create,
    update,
    remove,
    savePermissions,
    isMutating,
  } = useAdminRoles({ page: 1, limit: ROLE_PAGE_SIZE });

  // The assigned-staff drawer lists who holds a role, which the role rows only
  // carry as a count.
  const { staff: staffDtos } = useStaff({ page: 1, limit: 100 });

  // For the modal's department scope. The field takes a departmentId, so the
  // options have to be real records rather than typed-in names.
  const { departments: departmentDtos } = useDepartments({ limit: 100 });

  const [activeTab, setActiveTab] = useState<TabView>('cards');
  const [search, setSearch] = useState('');

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<StaffRole | null>(null);

  const [assignedStaffRole, setAssignedStaffRole] = useState<StaffRole | null>(null);
  const [isAssignedStaffOpen, setIsAssignedStaffOpen] = useState(false);
  const [newlyCreatedRoleId, setNewlyCreatedRoleId] = useState<string | null>(null);

  const roles = useMemo(() => roleDtos.map(mapAdminRole), [roleDtos]);
  const departments = useMemo(
    () => departmentDtos.map((d) => ({ id: d.id, name: d.name })),
    [departmentDtos],
  );
  const staffList = useMemo<StaffMember[]>(() => staffDtos.map(mapStaff), [staffDtos]);

  const stats = useMemo(() => {
    const total = roles.length;
    // Always 0: AdminRoleDefinition has no system flag. See mapAdminRole.
    const system = roles.filter((r) => r.isSystemRole).length;
    const custom = total - system;
    const totalScopes = ALL_PERMISSIONS.length;
    return { total, system, custom, totalScopes };
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const needle = search.toLowerCase();
    return roles.filter((r) => {
      if (r.isArchived) return false;
      return `${r.name || ''} ${r.description || ''}`.toLowerCase().includes(needle);
    });
  }, [roles, search]);

  const getStaffForRole = (roleId: string): StaffMember[] =>
    staffList.filter((s) => s.roleId === roleId || (s.roleIds || []).includes(roleId));

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: StaffRole) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  // DELETE /admin/roles/{id}. The server refuses when admins still hold the
  // role and says how many — surfaced as a toast by the hook rather than
  // guessed at here, since this page's copy of the count can be stale.
  const handleDeleteRole = (role: StaffRole) => {
    remove(role.id, {
      onSuccess: () => {
        if (newlyCreatedRoleId === role.id) setNewlyCreatedRoleId(null);
      },
    });
  };

  // PUT replaces the whole permission set, so the toggled result is sent in
  // full. No local state to patch: the mutation invalidates the list.
  const handleToggleMatrixPermission = (role: StaffRole, permCode: string) => {
    const current = role.permissions || [];
    const next = Array.isArray(current)
      ? current.includes(permCode)
        ? current.filter((c) => c !== permCode)
        : [...current, permCode]
      : [permCode];
    savePermissions(role.id, next as string[]);
  };

  // Create and edit both carry a permission set, but name/description/
  // department and permissions are two different endpoints — so a create is
  // POST followed by PUT permissions, and an edit is PATCH plus PUT.
  const handleSaveRole = (roleData: {
    name: string;
    description: string;
    departmentId?: string;
    permissions: string[];
  }) => {
    const { permissions, departmentId, ...fields } = roleData;

    if (editingRole) {
      update(
        editingRole.id,
        { ...fields, departmentId: departmentId ?? null },
        {
          onSuccess: () => {
            savePermissions(editingRole.id, permissions, {
              onSuccess: () => setIsRoleModalOpen(false),
            });
          },
        },
      );
      return;
    }

    create(
      { ...fields, ...(departmentId ? { departmentId } : {}) },
      {
        // The created role itself, straight from the POST response. This used
        // to look the new role up by name in `roleDtos` — the list as it was
        // *before* the create, since the invalidation refetch has not landed
        // when this runs. The lookup therefore missed every time and the
        // permission set chosen in the modal was silently never applied.
        onSuccess: (created) => {
          if (permissions.length > 0) {
            savePermissions(created.id, permissions);
          }
          setNewlyCreatedRoleId(created.id);
          setIsRoleModalOpen(false);
        },
      },
    );
  };

  return {
    // `mounted` gated a localStorage read that no longer happens; the query's
    // own loading state is what the page should show.
    mounted: !isLoading,
    isLoading,
    error,
    isMutating,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    isRoleModalOpen,
    setIsRoleModalOpen,
    editingRole,
    assignedStaffRole,
    setAssignedStaffRole,
    isAssignedStaffOpen,
    setIsAssignedStaffOpen,
    newlyCreatedRoleId,
    roles,
    departments,
    stats,
    filteredRoles,
    getStaffForRole,
    handleOpenCreateRole,
    handleOpenEditRole,
    handleDeleteRole,
    handleToggleMatrixPermission,
    handleSaveRole,
  };
}
