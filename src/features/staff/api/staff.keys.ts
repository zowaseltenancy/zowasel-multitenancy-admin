import {
  AdminPermissionListQuery,
  AdminRoleListQuery,
  DepartmentListQuery,
  LeaveCalendarQuery,
  LeaveOverviewQuery,
  MyLeaveRequestsQuery,
  StaffListQuery,
} from "./staff.types";

// Query keys for the whole staff-management module.
//
// Each resource has a root key so a mutation can invalidate everything under
// it with one call, and per-query keys below that. The roots matter because
// these resources are entangled: a role write changes the permissions embedded
// in every staff row, and a department write changes the dashboard's
// per-department counts — so writes invalidate more than their own list.
export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (query: StaffListQuery) => [...staffKeys.lists(), query] as const,
  detail: (id: string) => [...staffKeys.all, "detail", id] as const,
  stats: () => [...staffKeys.all, "stats"] as const,

  departments: () => ["departments"] as const,
  departmentList: (query: DepartmentListQuery) =>
    [...staffKeys.departments(), "list", query] as const,
  departmentDetail: (id: string) => [...staffKeys.departments(), "detail", id] as const,

  roles: () => ["admin-roles"] as const,
  roleList: (query: AdminRoleListQuery) => [...staffKeys.roles(), "list", query] as const,
  roleDetail: (id: string) => [...staffKeys.roles(), "detail", id] as const,

  permissions: () => ["admin-permissions"] as const,
  permissionList: (query: AdminPermissionListQuery) =>
    [...staffKeys.permissions(), "list", query] as const,

  leave: () => ["admin-leave"] as const,
  leaveBalances: (year?: number) => [...staffKeys.leave(), "balances", year ?? "current"] as const,
  myLeave: (query: MyLeaveRequestsQuery) => [...staffKeys.leave(), "mine", query] as const,
  leaveOverview: (query: LeaveOverviewQuery) => [...staffKeys.leave(), "overview", query] as const,
  leaveCalendar: (query: LeaveCalendarQuery) => [...staffKeys.leave(), "calendar", query] as const,
};
