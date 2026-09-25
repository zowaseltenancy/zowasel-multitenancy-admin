import { ApiMeta } from "@/lib/api-response";

// ── Staff (platform admin accounts) ──────────────────────────────────────────
// Mirrors auth-service's StaffDto. These are Zowasel staff out of the `admins`
// table — NOT tenant users, which live behind /admin/users.

export type StaffSystemRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";
export type StaffStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// ── Staff HR sub-records ─────────────────────────────────────────────────────
// The optional sections of the onboarding form, each 1:1 with the staff record
// and every field nullable — a contact with only a name and a number is a
// valid record, not a partial one.

export interface StaffNextOfKin {
  fullName: string | null;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface StaffBankDetail {
  bankName: string | null;
  accountNumber: string | null;
  sortCode: string | null;
  taxId: string | null;
}

export interface StaffDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: StaffSystemRole;
  systemRole?: string;
  status: StaffStatus;
  isActive: boolean;
  department: { id: string; name: string } | null;
  manager: { id: string; firstName: string | null; lastName: string | null } | null;
  roles: Array<{ id: string; name: string }>;
  permissions: string[];
  /**
   * The headshot as stored: either a `data:image/...;base64,` URL (what the
   * onboarding form's webcam step produces) or an http(s) URL once images are
   * hosted. Render it directly — do not assume one form.
   */
  avatarUrl?: string | null;
  /** null when the staff member was onboarded without that section. */
  nextOfKin?: StaffNextOfKin | null;
  bankDetail?: StaffBankDetail | null;
  mobilenumber?: string | null;
  employmenttype?: string | null;
  country?: string | null;
  statusHistory?: Array<{ status: string; at: string; reason?: string }>;
  tempdelete?: number;
  deletedby?: string;
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
  /**
   * Base64 data URL or http(s) URL, capped server-side at 1,000,000 characters
   * (~750KB of image). POST /admin/staff is the one route whose body limit is
   * raised to allow an inline image.
   */
  avatarUrl?: string;
  /**
   * Sections with no values are skipped server-side rather than stored as a row
   * of nulls, so sending a wholly blank object is harmless — but the onboarding
   * page omits them anyway, which keeps `.strict()` validation honest about
   * what was actually collected.
   */
  nextOfKin?: Partial<StaffNextOfKin>;
  bank?: Partial<StaffBankDetail>;
}

/**
 * Note the absence of `role`: system-role changes go through their own
 * SUPER_ADMIN-guarded endpoint, so they are not part of a general update.
 */
export interface UpdateStaffPayload {
  departmentId?: string | null;
  managerId?: string | null;
  /** Same rules as create: base64 data URL or http(s) URL. */
  avatarUrl?: string | null;
  /**
   * Omit to leave the section untouched. Sending it with every field blank
   * clears the stored record — that is a deliberate edit, not a no-op, so the
   * edit form sends what is on screen rather than only non-empty fields.
   */
  nextOfKin?: Partial<StaffNextOfKin>;
  bank?: Partial<StaffBankDetail>;
}

// ── Staff stats ──────────────────────────────────────────────────────────────
// GET /admin/staff/stats. Platform-wide counts, computed server-side with
// grouped queries — the directory is paginated, so tallying the fetched page
// would answer a different question.

export interface StaffStatsDto {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  bySystemRole: Record<StaffSystemRole, number>;
  /** Every department, including those with no staff. */
  byDepartment: Array<{ id: string; name: string; count: number }>;
  /** Staff with no department assigned. */
  unassigned: number;
  onboardedLast30Days: number;
}

// ── Departments ──────────────────────────────────────────────────────────────
// Mirrors auth-service's DepartmentDto.

export interface DepartmentDto {
  id: string;
  name: string;
  description: string | null;
  head: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
  adminCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DepartmentListResult {
  items: DepartmentDto[];
  meta: ApiMeta;
}

export interface CreateDepartmentPayload {
  name: string;
  description?: string;
  headId?: string;
}

/** `headId: null` vacates the post; omitting it leaves the head untouched. */
export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
  headId?: string | null;
}

// ── Admin roles ──────────────────────────────────────────────────────────────
// The assignable roles staff are granted, each carrying a set of permission
// keys. Distinct from StaffSystemRole, which is the hard SUPER_ADMIN/ADMIN/
// STAFF tier on the account itself.

/**
 * The one-time result of POST /admin/staff/{id}/reset-password.
 *
 * `temporaryPassword` exists only in this response — the server keeps an argon2
 * hash, and the staff member's notice email deliberately omits it, so there is
 * no second copy to go back for.
 */
export interface StaffPasswordResetDto {
  id: string;
  email: string;
  temporaryPassword: string;
  /** False when the notice could not be sent. The reset still happened. */
  noticeSent: boolean;
}

export interface AdminRoleDto {
  id: string;
  name: string;
  description: string | null;
  department: { id: string; name: string } | null;
  permissions: string[];
  assignedAdminCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRoleListQuery {
  page?: number;
  limit?: number;
  departmentId?: string;
}

export interface AdminRoleListResult {
  items: AdminRoleDto[];
  meta: ApiMeta;
}

export interface CreateAdminRolePayload {
  name: string;
  description?: string;
  departmentId?: string;
}

export interface UpdateAdminRolePayload {
  name?: string;
  description?: string;
  departmentId?: string | null;
}

// ── Permission catalog ───────────────────────────────────────────────────────
// The vocabulary of capability keys roles draw on. Create and delete are
// SUPER_ADMIN-only server-side: widening the vocabulary is a step above what
// any assignable role should do.

export interface AdminPermissionDto {
  id: string;
  key: string;
  description: string | null;
  createdAt: string;
}

export interface AdminPermissionListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AdminPermissionListResult {
  items: AdminPermissionDto[];
  meta: ApiMeta;
}

export interface CreateAdminPermissionPayload {
  key: string;
  description?: string;
}

// ── Leave ────────────────────────────────────────────────────────────────────

export type LeaveType =
  | "ANNUAL"
  | "SICK"
  | "MATERNITY"
  | "PATERNITY"
  | "COMPASSIONATE"
  | "UNPAID";

export type LeaveRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveBalanceDto {
  type: LeaveType;
  year: number;
  entitledDays: number;
  usedDays: number;
  /** Locked up by submitted-but-unreviewed requests; not yet deducted. */
  pendingDays: number;
  /** entitled - used - pending. What a new request can draw on. */
  availableDays: number;
}

export interface LeaveRequestDto {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string | null;
  status: LeaveRequestStatus;
  applicant: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    department: { id: string; name: string } | null;
  };
  reviewedBy: { id: string; firstName: string | null; lastName: string | null } | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequestListResult {
  items: LeaveRequestDto[];
  meta: ApiMeta;
}

export interface CreateLeaveRequestPayload {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface MyLeaveRequestsQuery {
  page?: number;
  limit?: number;
  status?: LeaveRequestStatus;
  type?: LeaveType;
  year?: number;
}

export interface LeaveOverviewQuery {
  page?: number;
  limit?: number;
  status?: LeaveRequestStatus;
  type?: LeaveType;
  departmentId?: string;
  adminId?: string;
  from?: string;
  to?: string;
}

/**
 * Only the two terminal outcomes. A reviewer cannot push a request back to
 * PENDING, and CANCELLED belongs to the applicant.
 */
export interface ReviewLeaveRequestPayload {
  decision: "APPROVED" | "REJECTED";
  note?: string;
}

export interface LeaveCalendarQuery {
  from: string;
  to: string;
  departmentId?: string;
  /** Approved leave only unless set — a calendar is for planning around granted leave. */
  includePending?: boolean;
}

export interface LeaveCalendarEntryDto {
  id: string;
  type: LeaveType;
  status: LeaveRequestStatus;
  startDate: string;
  endDate: string;
  days: number;
  admin: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    department: { id: string; name: string } | null;
  };
}
