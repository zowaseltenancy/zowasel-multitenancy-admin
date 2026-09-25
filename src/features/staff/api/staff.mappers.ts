import { Department, DepartmentRole, StaffMember, StaffRole } from "@/types/staff";
import { LeaveRequest, LeaveStatus, LeaveType as UiLeaveType } from "@/types/staff";
import {
  AdminRoleDto,
  DepartmentDto,
  LeaveRequestDto,
  StaffDto,
  StaffSystemRole,
} from "./staff.types";

// Translation between auth-service's DTOs and the types the staff screens are
// written against. The two vocabularies differ in ways worth naming:
//
//   status       API is upper case (ACTIVE), the UI union is lower case.
//   systemRole   API is SUPER_ADMIN, the UI union is super_admin.
//   department   API returns a { id, name } object; the UI carries a flat name
//                plus the object alongside it.
//
// Every one of those was a silent mismatch before: comparisons against the
// lower-case forms failed for API-sourced records, which is how a super admin
// came to render as "Admin".

// ── Staff ────────────────────────────────────────────────────────────────────

function toUiStatus(value: string): StaffMember["status"] {
  switch (value.toLowerCase()) {
    case "active":
      return "active";
    case "suspended":
      return "suspended";
    case "inactive":
    default:
      return "inactive";
  }
}

function toUiSystemRole(value: StaffSystemRole | string | undefined): StaffMember["systemRole"] {
  switch (value?.toLowerCase()) {
    case "super_admin":
      return "super_admin";
    case "admin":
      return "admin";
    case "staff":
      return "staff";
    default:
      return undefined;
  }
}

/** The reverse, for writes. The API's enum is upper case. */
export function toApiSystemRole(value: string | undefined): StaffSystemRole {
  switch (value?.toLowerCase()) {
    case "super_admin":
      return "SUPER_ADMIN";
    case "admin":
      return "ADMIN";
    default:
      return "STAFF";
  }
}

/** The reverse for status. */
export function toApiStatus(value: string | undefined): "ACTIVE" | "INACTIVE" | "SUSPENDED" {
  switch (value?.toLowerCase()) {
    case "active":
      return "ACTIVE";
    case "suspended":
      return "SUSPENDED";
    default:
      return "INACTIVE";
  }
}

/**
 * The API's sub-records use `null` for "not recorded"; the UI types use
 * optional fields. Passing null straight through puts `null` in form inputs,
 * which React renders as an uncontrolled-input warning and a literal empty.
 */
function nullsToUndefined<T extends object>(
  record: T,
): { [K in keyof T]?: NonNullable<T[K]> } {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, value ?? undefined]),
  ) as { [K in keyof T]?: NonNullable<T[K]> };
}

export function mapStaff(dto: StaffDto): StaffMember {
  return {
    id: dto.id,
    firstName: dto.firstName ?? "",
    lastName: dto.lastName ?? "",
    email: dto.email,
    phone: dto.mobilenumber ?? undefined,
    mobilenumber: dto.mobilenumber ?? undefined,
    country: dto.country ?? undefined,
    employmenttype: dto.employmenttype ?? undefined,
    // Flat name for the screens that render or filter on it, plus the object.
    department: dto.department?.name ?? "",
    departmentId: dto.department?.id,
    departmentObj: dto.department,
    // The API models assignable roles as a set; the UI's single `roleId` is
    // the first of them, which is what its role-name lookups expect.
    roleId: dto.roles[0]?.id ?? "",
    roleIds: dto.roles.map((r) => r.id),
    roles: dto.roles,
    permissions: dto.permissions,
    systemRole: toUiSystemRole(dto.role ?? dto.systemRole),
    status: toUiStatus(dto.status),
    statusHistory: dto.statusHistory,
    manager: dto.manager,
    // The HR record the onboarding form collects. Carried through because the
    // profile tabs and the edit form read these off StaffMember — before the
    // staff endpoint stored them there was nothing to map, so they were left
    // out and every screen showed a blank section.
    //
    // Note the rename: the API field is `bankDetail` (it mirrors the table),
    // the UI type calls it `bank` (it mirrors the form). Mapping it here is the
    // whole reason a mapper exists.
    avatarUrl: dto.avatarUrl ?? undefined,
    nextOfKin: dto.nextOfKin ? nullsToUndefined(dto.nextOfKin) : undefined,
    bank: dto.bankDetail ? nullsToUndefined(dto.bankDetail) : undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    dateJoined: dto.createdAt,
  };
}

// ── Departments ──────────────────────────────────────────────────────────────

export function mapDepartment(dto: DepartmentDto): Department {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    // Department.headId is `string | null`, not optional — null is the
    // vacated post, which is a real state the drawer can set.
    headId: dto.head?.id ?? null,
    // Denormalised for the cards, which show the head without a second lookup.
    headName: dto.head ? [dto.head.firstName, dto.head.lastName].filter(Boolean).join(" ") : undefined,
    staffCount: dto.adminCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// ── Roles ────────────────────────────────────────────────────────────────────

/**
 * `isSystemRole` is always false, and `isArchived` always undefined.
 *
 * Neither concept exists server-side: AdminRoleDefinition has no system flag
 * and no archive column. What actually protects a role from deletion is the
 * assigned-admin count — the API refuses to delete a role that any admin still
 * holds — so that guard replaces the UI's "system roles cannot be deleted"
 * rule rather than being reproduced client-side.
 *
 * The consequence is visible: the roles page's system-vs-custom stat split now
 * reads 0 system. That is the truth about the data, not a mapping loss.
 */
export function mapAdminRole(dto: AdminRoleDto): StaffRole {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    permissions: dto.permissions,
    isSystemRole: false,
    departmentId: dto.department?.id ?? null,
    department: dto.department,
    assignedAdminCount: dto.assignedAdminCount,
    userCount: dto.assignedAdminCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

/**
 * A department-scoped role, for the screens typed on DepartmentRole.
 *
 * Same rows as mapAdminRole — the API has one role table, and a role is
 * department-scoped exactly when it carries a departmentId. Only call this for
 * roles already filtered to one department, since DepartmentRole requires it.
 */
export function mapDepartmentRole(dto: AdminRoleDto, fallbackDepartmentId: string): DepartmentRole {
  return {
    id: dto.id,
    departmentId: dto.department?.id ?? fallbackDepartmentId,
    name: dto.name,
    description: dto.description ?? "",
    permissions: dto.permissions,
    isSystemRole: false,
    assignedAdminCount: dto.assignedAdminCount,
    userCount: dto.assignedAdminCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// ── Leave ────────────────────────────────────────────────────────────────────

function toUiLeaveType(value: string): UiLeaveType {
  // The wire value, unchanged. This used to lower-case it — producing "annual",
  // which was not a member of the union it was cast to, and which no filter or
  // comparison in the console matched. Screens render it through
  // leaveTypeLabel(); nothing compares against a transformed copy.
  const normalized = value.toUpperCase();
  const known = ["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "COMPASSIONATE", "UNPAID"];
  return (known.includes(normalized) ? normalized : "ANNUAL") as UiLeaveType;
}

function toUiLeaveStatus(value: string): LeaveStatus {
  const normalized = value.toLowerCase();
  const known = ["pending", "approved", "rejected", "cancelled"];
  return (known.includes(normalized) ? normalized : "pending") as LeaveStatus;
}

export function mapLeaveRequest(dto: LeaveRequestDto): LeaveRequest {
  const applicantName =
    [dto.applicant.firstName, dto.applicant.lastName].filter(Boolean).join(" ") ||
    dto.applicant.email;

  return {
    id: dto.id,
    staffId: dto.applicant.id,
    employeeName: applicantName,
    department: dto.applicant.department?.name ?? undefined,
    type: toUiLeaveType(dto.type),
    startDate: dto.startDate,
    endDate: dto.endDate,
    // The API computes working days server-side; both UI fields read from it.
    workingDays: dto.days,
    days: dto.days,
    reason: dto.reason ?? "",
    status: toUiLeaveStatus(dto.status),
    approvedBy: dto.reviewedBy
      ? [dto.reviewedBy.firstName, dto.reviewedBy.lastName].filter(Boolean).join(" ") || undefined
      : undefined,
    reviewNote: dto.reviewNote ?? undefined,
    reviewedAt: dto.reviewedAt ?? undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
