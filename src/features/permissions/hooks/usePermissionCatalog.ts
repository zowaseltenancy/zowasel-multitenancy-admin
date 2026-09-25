"use client";

import { useMemo } from "react";

import { Permission, PermissionCategory, PermissionCategoryGroup } from "@/types/permissions";
import { ALL_PERMISSIONS, PERMISSION_CATEGORIES } from "@/constants/permissions";
import { useAdminPermissions } from "@/features/staff/hooks/useStaff";
import { AdminPermissionDto } from "@/features/staff/api/staff.types";

// The grantable permission catalogue: GET /admin/permissions, dressed for
// display with the metadata in ALL_PERMISSIONS.
//
// Shared by both screens that let someone assign scopes — the Permissions &
// Roles matrix and the role modal on the staff roles page — because they must
// offer the same set. The constant alone is not that set: of the 37 codes it
// declares, 24 do not exist server-side, and PUT /admin/roles/{id}/permissions
// validates every key it is given. Ticking one of those 24 produced a role the
// API refused to save, naming a scope the operator had no way to know was
// fictional; meanwhile two real scopes (departments:write, roles:write) were
// absent from the constant and so could not be granted from the console at all.
const CATALOG_LIMIT = 100;

const STATIC_BY_CODE = new Map(ALL_PERMISSIONS.map((p) => [p.code, p]));
const KNOWN_CATEGORIES = new Set(Object.keys(PERMISSION_CATEGORIES));

/** "read_all" → "Read all", "write" → "Write". */
function humanize(segment: string): string {
  const words = segment.replace(/[_-]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * A catalogue row as the pickers need it.
 *
 * The server stores `{ key, description }` and nothing more, so category,
 * friendly name and the sensitive flag come from ALL_PERMISSIONS when the key
 * is one it describes. When it is not — a scope added from the Permissions
 * screen, or one the constant has not caught up with — they are derived from
 * the key, which is `resource:action` by convention. The description prefers
 * the server's, since that is the catalogue of record.
 */
export function describePermission(dto: AdminPermissionDto): Permission {
  const known = STATIC_BY_CODE.get(dto.key);
  const [resource = dto.key, action = ""] = dto.key.split(":");

  const category: PermissionCategory = known
    ? known.category
    : KNOWN_CATEGORIES.has(resource)
      ? (resource as PermissionCategory)
      : "custom";

  return {
    id: dto.id,
    code: dto.key,
    name: known?.name ?? `${humanize(action || resource)} ${humanize(resource)}`.trim(),
    description: dto.description ?? known?.description ?? `Grants ${dto.key}`,
    category,
    action: known?.action ?? "read",
    ...(known?.isSensitive ? { isSensitive: true } : {}),
  };
}

/** Groups a flat catalogue by category, in the constant's declared order. */
export function groupPermissions(catalog: Permission[]): PermissionCategoryGroup[] {
  const byCategory = new Map<PermissionCategory, Permission[]>();
  for (const permission of catalog) {
    const bucket = byCategory.get(permission.category);
    if (bucket) bucket.push(permission);
    else byCategory.set(permission.category, [permission]);
  }

  return (Object.keys(PERMISSION_CATEGORIES) as PermissionCategory[])
    .filter((category) => byCategory.has(category))
    .map((category) => ({
      category,
      label: PERMISSION_CATEGORIES[category].label,
      description: PERMISSION_CATEGORIES[category].description,
      permissions: (byCategory.get(category) ?? []).sort((a, b) => a.code.localeCompare(b.code)),
    }));
}

export function usePermissionCatalog() {
  const { permissions: permissionDtos, isLoading, error } = useAdminPermissions({
    page: 1,
    limit: CATALOG_LIMIT,
  });

  const catalog = useMemo(() => permissionDtos.map(describePermission), [permissionDtos]);
  const groups = useMemo(() => groupPermissions(catalog), [catalog]);

  return { catalog, groups, isLoading, error };
}
