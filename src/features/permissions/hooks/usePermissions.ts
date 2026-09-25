"use client";

import { useMemo, useState } from "react";

import { PermissionCategory, PermissionCategoryGroup, Role } from "@/types/permissions";
import { PERMISSION_CATEGORIES } from "@/constants/permissions";
import { useAdminPermissions, useAdminRoles } from "@/features/staff/hooks/useStaff";
import { AdminRoleDto } from "@/features/staff/api/staff.types";
import { usePermissionCatalog } from "./usePermissionCatalog";

// Backed by /admin/roles and /admin/permissions.
//
// This screen used to run entirely on MOCK_ROLES and a localStorage key: every
// role, every toggle and every "create" lived in one browser. Two admins saw
// different access-control matrices, and nothing here had any bearing on what
// the platform actually enforced.
//
// Three consequences of the server being the authority now:
//
//   * The catalogue is the server's, not `ALL_PERMISSIONS`. That constant is
//     presentation metadata — friendly name, category, sensitivity — looked up
//     by key. A scope the server does not have cannot be granted (the API
//     rejects unknown keys), so showing it as a tickable box was a lie; of the
//     37 codes that constant declares, only 15 exist server-side.
//   * There are no system roles. AdminRoleDefinition has no such flag, so
//     `isSystemRole` is always false and no role is undeletable on that basis.
//     What actually protects a role is the assigned-admin count, which the API
//     enforces on DELETE.
//   * Toggling a scope issues PUT /admin/roles/{id}/permissions with the whole
//     resulting set, because that endpoint replaces rather than patches.
const CATALOG_LIMIT = 100;
const ROLE_LIMIT = 100;

// ── DTO → view model ─────────────────────────────────────────────────────────

function mapRole(dto: AdminRoleDto): Role {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    // See above: the concept does not exist server-side.
    isSystemRole: false,
    permissions: dto.permissions ?? [],
    userCount: dto.assignedAdminCount ?? 0,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function usePermissions() {
  const {
    roles: roleDtos,
    isLoading: rolesLoading,
    isFetching: rolesFetching,
    error: rolesError,
    create,
    update,
    remove,
    savePermissions,
    isMutating: rolesMutating,
  } = useAdminRoles({ page: 1, limit: ROLE_LIMIT });

  // The same catalogue the role modal on the staff roles page offers.
  const { catalog, groups, isLoading: catalogLoading, error: catalogError } = usePermissionCatalog();

  const {
    create: createPermission,
    remove: removePermission,
    isMutating: catalogMutating,
  } = useAdminPermissions({ page: 1, limit: CATALOG_LIMIT });

  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const roles = useMemo(() => roleDtos.map(mapRole), [roleDtos]);

  // Derived rather than synced in an effect: the selection follows the loaded
  // list, and a role that has just been deleted falls back to the first one
  // without a render pass that points at nothing.
  const selectedRole = useMemo<Role | null>(
    () => roles.find((r) => r.id === selectedRoleId) ?? roles[0] ?? null,
    [roles, selectedRoleId],
  );

  const filteredGroups = useMemo<PermissionCategoryGroup[]>(() => {
    const needle = searchQuery.trim().toLowerCase();

    return groups
      .filter((group) => categoryFilter === "all" || group.category === categoryFilter)
      .map((group) => ({
        ...group,
        permissions: needle
          ? group.permissions.filter((p) =>
              `${p.name} ${p.code} ${p.description}`.toLowerCase().includes(needle),
            )
          : group.permissions,
      }))
      .filter((group) => group.permissions.length > 0);
  }, [groups, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const assignedAdmins = roles.reduce((sum, role) => sum + (role.userCount || 0), 0);
    const sensitive = catalog.filter((p) => p.isSensitive).length;
    return {
      totalRoles: roles.length,
      totalScopes: catalog.length,
      totalCategories: groups.length,
      assignedAdmins,
      sensitive,
    };
  }, [roles, catalog, groups.length]);

  // ── Writes ─────────────────────────────────────────────────────────────────

  /** PUT replaces the set, so the toggled *result* is what gets sent. */
  const togglePermissionForRole = (roleId: string, permissionCode: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    const next = role.permissions.includes(permissionCode)
      ? role.permissions.filter((code) => code !== permissionCode)
      : [...role.permissions, permissionCode];

    savePermissions(roleId, next);
  };

  const toggleAllCategoryPermissionsForRole = (
    roleId: string,
    category: PermissionCategory,
    enable: boolean,
  ) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    // Only codes the catalogue actually has — granting one it does not is a
    // 422 from the endpoint, which validates every key in the set.
    const categoryCodes = catalog.filter((p) => p.category === category).map((p) => p.code);

    const next = enable
      ? Array.from(new Set([...role.permissions, ...categoryCodes]))
      : role.permissions.filter((code) => !categoryCodes.includes(code));

    savePermissions(roleId, next);
  };

  /**
   * POST /admin/roles, then PUT its permissions — name/description and the
   * permission set are two endpoints. The new role's id comes from the POST
   * response, so the second call cannot race the list refetch.
   */
  const createRole = (
    data: { name: string; description: string; permissions: string[] },
    options?: { onSettled?: () => void },
  ) => {
    create(
      { name: data.name, description: data.description },
      {
        onSuccess: (created) => {
          setSelectedRoleId(created.id);
          if (data.permissions.length > 0) {
            savePermissions(created.id, data.permissions, { onSuccess: options?.onSettled });
          } else {
            options?.onSettled?.();
          }
        },
      },
    );
  };

  /** PATCH the fields, then PUT the set — same split as create. */
  const updateRoleInfo = (
    roleId: string,
    data: { name: string; description: string; permissions?: string[] },
    options?: { onSettled?: () => void },
  ) => {
    update(
      roleId,
      { name: data.name, description: data.description },
      {
        onSuccess: () => {
          if (data.permissions) {
            savePermissions(roleId, data.permissions, { onSuccess: options?.onSettled });
          } else {
            options?.onSettled?.();
          }
        },
      },
    );
  };

  /**
   * The server refuses a role that admins still hold, and says how many. That
   * refusal surfaces as the mutation's error toast rather than being
   * pre-empted here, where the count can be stale.
   */
  const deleteRole = (roleId: string, options?: { onSettled?: () => void }) => {
    remove(roleId, {
      onSuccess: () => {
        if (selectedRoleId === roleId) setSelectedRoleId("");
        options?.onSettled?.();
      },
    });
  };

  /** POST /admin/permissions. SUPER_ADMIN only — a 403 says the caller is not one. */
  const createCustomPermission = (
    data: { key: string; description?: string },
    options?: { onSettled?: () => void },
  ) => {
    createPermission(
      { key: data.key, ...(data.description ? { description: data.description } : {}) },
      { onSuccess: () => options?.onSettled?.() },
    );
  };

  /** DELETE /admin/permissions/{id}. Cascades to every role that held it. */
  const deleteCustomPermission = (permissionId: string, options?: { onSettled?: () => void }) => {
    removePermission(permissionId, { onSuccess: () => options?.onSettled?.() });
  };

  return {
    roles,
    catalog,
    selectedRole,
    selectedRoleId: selectedRole?.id ?? "",
    setSelectedRoleId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    groups,
    filteredGroups,
    stats,

    // Only the first fetch blanks the screen; a refetch after a write leaves
    // the matrix on screen and merely disables it.
    isLoading: rolesLoading || catalogLoading,
    isFetching: rolesFetching,
    isMutating: rolesMutating || catalogMutating,
    error: rolesError ?? catalogError ?? null,

    togglePermissionForRole,
    toggleAllCategoryPermissionsForRole,
    createRole,
    updateRoleInfo,
    deleteRole,
    createCustomPermission,
    deleteCustomPermission,
  };
}
