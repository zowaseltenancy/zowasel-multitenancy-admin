export type PermissionCategory =
  | "organizations"
  | "kyb"
  | "modules"
  | "billing"
  | "users"
  | "roles"
  | "system";

export type PermissionAction = "read" | "create" | "update" | "delete" | "approve" | "export";

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  category: PermissionCategory;
  action: PermissionAction;
  isSensitive?: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: string[]; // array of permission codes
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionCategoryGroup {
  category: PermissionCategory;
  label: string;
  description: string;
  permissions: Permission[];
}
