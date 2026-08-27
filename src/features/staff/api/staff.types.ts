import { ApiMeta } from "@/lib/api-response";

// ── Staff (platform admin accounts) ──────────────────────────────────────────
// Mirrors auth-service's StaffDto. These are Zowasel staff out of the `admins`
// table — NOT tenant users, which live behind /admin/users.

export type StaffSystemRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";
export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface StaffDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: StaffSystemRole;
  status: StaffStatus;
  isActive: boolean;
  department: { id: string; name: string } | null;
  manager: { id: string; firstName: string | null; lastName: string | null } | null;
  roles: Array<{ id: string; name: string }>;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffListQuery {
  page?: number;
  limit?: number;
  departmentId?: string;
  role?: StaffSystemRole;
  status?: StaffStatus;
  isActive?: boolean;
  search?: string;
}

export interface StaffListResult {
  items: StaffDto[];
  meta: ApiMeta;
}

export interface CreateStaffPayload {
  email: string;
  role: StaffSystemRole;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  managerId?: string;
}

/**
 * Note the absence of `role`: system-role changes go through their own
 * SUPER_ADMIN-guarded endpoint, so they are not part of a general update.
 */
export interface UpdateStaffPayload {
  departmentId?: string | null;
  managerId?: string | null;
}

export interface DepartmentDto {
  id: string;
  name: string;
  description: string | null;
}
