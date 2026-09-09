import { useState, useMemo, useEffect } from "react";
import { Role, PermissionCategory } from "@/types/permissions";
import { MOCK_ROLES } from "../data/mockRoles";
import { ALL_PERMISSIONS, PERMISSION_GROUPS } from "@/constants/permissions";

const STORAGE_KEY = "platform_permissions_roles_db";

function getStoredRoles(): Role[] {
  if (typeof window === "undefined") return MOCK_ROLES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return MOCK_ROLES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MOCK_ROLES;
  } catch {
    return MOCK_ROLES;
  }
}

function persistRoles(roles: Role[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
    } catch (e) {
      console.error("Failed to persist platform roles", e);
    }
  }
}

export function usePermissions() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(MOCK_ROLES[0].id);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    const stored = getStoredRoles();
    setRoles(stored);
    if (stored.length > 0 && !stored.some((r) => r.id === selectedRoleId)) {
      setSelectedRoleId(stored[0].id);
    }
  }, []);

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  const filteredGroups = useMemo(() => {
    return PERMISSION_GROUPS.map((group) => {
      if (categoryFilter !== "all" && group.category !== categoryFilter) {
        return null;
      }

      const filteredPermissions = group.permissions.filter((p) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      });

      if (filteredPermissions.length === 0) return null;

      return {
        ...group,
        permissions: filteredPermissions,
      };
    }).filter(Boolean);
  }, [searchQuery, categoryFilter]);

  const togglePermissionForRole = (roleId: string, permissionCode: string) => {
    setRoles((prevRoles) => {
      const next = prevRoles.map((role) => {
        if (role.id !== roleId) return role;
        if (role.isSystemRole) return role; // Protect system roles

        const exists = role.permissions.includes(permissionCode);
        const newPermissions = exists
          ? role.permissions.filter((code) => code !== permissionCode)
          : [...role.permissions, permissionCode];

        return {
          ...role,
          permissions: newPermissions,
          updatedAt: new Date().toISOString(),
        };
      });
      persistRoles(next);
      return next;
    });
  };

  const toggleAllCategoryPermissionsForRole = (
    roleId: string,
    category: PermissionCategory,
    enable: boolean
  ) => {
    const categoryCodes = ALL_PERMISSIONS.filter((p) => p.category === category).map((p) => p.code);

    setRoles((prevRoles) => {
      const next = prevRoles.map((role) => {
        if (role.id !== roleId || role.isSystemRole) return role;

        let newPermissions: string[];
        if (enable) {
          newPermissions = Array.from(new Set([...role.permissions, ...categoryCodes]));
        } else {
          newPermissions = role.permissions.filter((code) => !categoryCodes.includes(code));
        }

        return {
          ...role,
          permissions: newPermissions,
          updatedAt: new Date().toISOString(),
        };
      });
      persistRoles(next);
      return next;
    });
  };

  const createRole = (data: { name: string; description: string; permissions: string[] }) => {
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: data.name,
      description: data.description,
      isSystemRole: false,
      permissions: data.permissions,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoles((prev) => {
      const next = [...prev, newRole];
      persistRoles(next);
      return next;
    });
    setSelectedRoleId(newRole.id);
    return newRole;
  };

  const updateRoleInfo = (
    roleId: string,
    data: { name: string; description: string; permissions?: string[] }
  ) => {
    setRoles((prevRoles) => {
      const next = prevRoles.map((role) => {
        if (role.id !== roleId) return role;

        return {
          ...role,
          name: data.name,
          description: data.description,
          permissions: data.permissions ?? role.permissions,
          updatedAt: new Date().toISOString(),
        };
      });
      persistRoles(next);
      return next;
    });
  };

  const deleteRole = (roleId: string) => {
    setRoles((prev) => {
      const next = prev.filter((r) => r.id !== roleId && !r.isSystemRole);
      persistRoles(next);
      return next;
    });
    if (selectedRoleId === roleId) {
      setSelectedRoleId(MOCK_ROLES[0].id);
    }
  };

  return {
    roles,
    selectedRole,
    selectedRoleId,
    setSelectedRoleId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    filteredGroups,
    togglePermissionForRole,
    toggleAllCategoryPermissionsForRole,
    createRole,
    updateRoleInfo,
    deleteRole,
  };
}
