import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  AdminPermissionDto,
  AdminPermissionListQuery,
  AdminPermissionListResult,
  AdminRoleDto,
  AdminRoleListQuery,
  AdminRoleListResult,
  CreateAdminPermissionPayload,
  CreateAdminRolePayload,
  CreateDepartmentPayload,
  CreateLeaveRequestPayload,
  CreateStaffPayload,
  DepartmentDto,
  DepartmentListQuery,
  DepartmentListResult,
  LeaveBalanceDto,
  LeaveCalendarEntryDto,
  LeaveCalendarQuery,
  LeaveOverviewQuery,
  LeaveRequestDto,
  LeaveRequestListResult,
  MyLeaveRequestsQuery,
  ReviewLeaveRequestPayload,
  StaffDto,
  StaffListQuery,
  StaffPasswordResetDto,
  StaffListResult,
  StaffStatsDto,
  StaffStatus,
  StaffSystemRole,
  UpdateAdminRolePayload,
  UpdateDepartmentPayload,
  UpdateStaffPayload,
} from "./staff.types";

// "all" is the UI's word for "no filter", so it is dropped rather than sent —
// the server would reject it against a closed enum.
function cleanParams(params: object) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== "all",
    ),
  );
}

/** Falls back to a single-page meta when the server omits it. */
function metaOf<T>(data: ApiResponse<T[]>, params: { page?: number; limit?: number }) {
  return (
    data.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? data.data.length,
      total: data.data.length,
      totalPages: 1,
    }
  );
}

export const staffApi = {
  async list(params: StaffListQuery = {}): Promise<StaffListResult> {
    const { data } = await apiClient.get<ApiResponse<StaffDto[]>>("/admin/staff", {
      params: cleanParams(params),
    });
    return {
      items: data.data,
      meta:
        data.meta ?? {
          page: params.page ?? 1,
          limit: params.limit ?? data.data.length,
          total: data.data.length,
          totalPages: 1,
        },
    };
  },

  async detail(id: string): Promise<StaffDto> {
    const { data } = await apiClient.get<ApiResponse<StaffDto>>(`/admin/staff/${id}`);
    return data.data;
  },

  /** Creates an inactive shell and emails an invitation; no password is set here. */
  async create(payload: CreateStaffPayload): Promise<StaffDto> {
    const { data } = await apiClient.post<ApiResponse<StaffDto>>("/admin/staff", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateStaffPayload): Promise<StaffDto> {
    const { data } = await apiClient.patch<ApiResponse<StaffDto>>(`/admin/staff/${id}`, payload);
    return data.data;
  },

  async setStatus(id: string, status: StaffStatus, reason?: string): Promise<StaffDto> {
    const { data } = await apiClient.patch<ApiResponse<StaffDto>>(
      `/admin/staff/${id}/status`,
      { status, reason },
    );
    return data.data;
  },

  /** SUPER_ADMIN only — deliberately its own endpoint, not part of update(). */
  async setSystemRole(id: string, role: StaffSystemRole): Promise<StaffDto> {
    const { data } = await apiClient.patch<ApiResponse<StaffDto>>(
      `/admin/staff/${id}/system-role`,
      { role },
    );
    return data.data;
  },

  /** Replaces the full assigned-role set (PUT semantics, not a merge). */
  async setRoles(id: string, roleIds: string[]): Promise<StaffDto> {
    const { data } = await apiClient.put<ApiResponse<StaffDto>>(
      `/admin/staff/${id}/roles`,
      { roleIds },
    );
    return data.data;
  },

  /**
   * POST /admin/staff/{id}/reset-password.
   *
   * No body: the password is generated server-side. The response carries it
   * once, for the admin to hand over — it is not recoverable afterwards.
   */
  async resetPassword(id: string): Promise<StaffPasswordResetDto> {
    const { data } = await apiClient.post<ApiResponse<StaffPasswordResetDto>>(
      `/admin/staff/${id}/reset-password`,
    );
    return data.data;
  },

  /** GET /admin/staff/stats — platform-wide counts for the dashboard cards. */
  async stats(): Promise<StaffStatsDto> {
    const { data } = await apiClient.get<ApiResponse<StaffStatsDto>>("/admin/staff/stats");
    return data.data;
  },

  /**
   * DELETE /admin/staff/{id}. A soft delete server-side: the record leaves the
   * directory, the stats and authentication, but the row survives because
   * audit logs, leads, leave and the tenant staff columns reference it.
   *
   * Refused for your own account, for a super admin unless you are one, and
   * for the last active super admin.
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/staff/${id}`);
  },
};

// ── Departments ──────────────────────────────────────────────────────────────

export const departmentsApi = {
  async list(params: DepartmentListQuery = {}): Promise<DepartmentListResult> {
    const { data } = await apiClient.get<ApiResponse<DepartmentDto[]>>("/admin/departments", {
      params: cleanParams({ limit: 100, ...params }),
    });
    return { items: data.data, meta: metaOf(data, params) };
  },

  async detail(id: string): Promise<DepartmentDto> {
    const { data } = await apiClient.get<ApiResponse<DepartmentDto>>(`/admin/departments/${id}`);
    return data.data;
  },

  async create(payload: CreateDepartmentPayload): Promise<DepartmentDto> {
    const { data } = await apiClient.post<ApiResponse<DepartmentDto>>("/admin/departments", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateDepartmentPayload): Promise<DepartmentDto> {
    const { data } = await apiClient.patch<ApiResponse<DepartmentDto>>(
      `/admin/departments/${id}`,
      payload,
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/departments/${id}`);
  },
};

// ── Admin roles ──────────────────────────────────────────────────────────────

export const adminRolesApi = {
  async list(params: AdminRoleListQuery = {}): Promise<AdminRoleListResult> {
    const { data } = await apiClient.get<ApiResponse<AdminRoleDto[]>>("/admin/roles", {
      params: cleanParams({ limit: 100, ...params }),
    });
    return { items: data.data, meta: metaOf(data, params) };
  },

  async detail(id: string): Promise<AdminRoleDto> {
    const { data } = await apiClient.get<ApiResponse<AdminRoleDto>>(`/admin/roles/${id}`);
    return data.data;
  },

  async create(payload: CreateAdminRolePayload): Promise<AdminRoleDto> {
    const { data } = await apiClient.post<ApiResponse<AdminRoleDto>>("/admin/roles", payload);
    return data.data;
  },

  async update(id: string, payload: UpdateAdminRolePayload): Promise<AdminRoleDto> {
    const { data } = await apiClient.patch<ApiResponse<AdminRoleDto>>(`/admin/roles/${id}`, payload);
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/roles/${id}`);
  },

  /**
   * PUT, not PATCH — the permission set is replaced wholesale, so the payload
   * is the complete list the role should end up with, not a delta.
   */
  async setPermissions(id: string, permissionKeys: string[]): Promise<AdminRoleDto> {
    const { data } = await apiClient.put<ApiResponse<AdminRoleDto>>(
      `/admin/roles/${id}/permissions`,
      { permissionKeys },
    );
    return data.data;
  },
};

// ── Permission catalog ───────────────────────────────────────────────────────

export const adminPermissionsApi = {
  async list(params: AdminPermissionListQuery = {}): Promise<AdminPermissionListResult> {
    const { data } = await apiClient.get<ApiResponse<AdminPermissionDto[]>>("/admin/permissions", {
      params: cleanParams({ limit: 100, ...params }),
    });
    return { items: data.data, meta: metaOf(data, params) };
  },

  /** SUPER_ADMIN only server-side. */
  async create(payload: CreateAdminPermissionPayload): Promise<AdminPermissionDto> {
    const { data } = await apiClient.post<ApiResponse<AdminPermissionDto>>(
      "/admin/permissions",
      payload,
    );
    return data.data;
  },

  /** SUPER_ADMIN only server-side. */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/permissions/${id}`);
  },
};

// ── Leave ────────────────────────────────────────────────────────────────────
// `myBalances`, `myRequests` and `submit` are the signed-in admin's own leave —
// open to any platform admin. `overview`, `review` and `calendar` are the
// management views and require leave:review / leave:read_calendar.

export const leaveApi = {
  async myBalances(year?: number): Promise<LeaveBalanceDto[]> {
    const { data } = await apiClient.get<ApiResponse<LeaveBalanceDto[]>>(
      "/admin/leave/balances/me",
      { params: cleanParams({ year }) },
    );
    return data.data;
  },

  async myRequests(params: MyLeaveRequestsQuery = {}): Promise<LeaveRequestListResult> {
    const { data } = await apiClient.get<ApiResponse<LeaveRequestDto[]>>(
      "/admin/leave/requests/me",
      { params: cleanParams({ limit: 50, ...params }) },
    );
    return { items: data.data, meta: metaOf(data, params) };
  },

  async submit(payload: CreateLeaveRequestPayload): Promise<LeaveRequestDto> {
    const { data } = await apiClient.post<ApiResponse<LeaveRequestDto>>(
      "/admin/leave/requests",
      payload,
    );
    return data.data;
  },

  async overview(params: LeaveOverviewQuery = {}): Promise<LeaveRequestListResult> {
    const { data } = await apiClient.get<ApiResponse<LeaveRequestDto[]>>(
      "/admin/leave/requests/overview",
      { params: cleanParams({ limit: 50, ...params }) },
    );
    return { items: data.data, meta: metaOf(data, params) };
  },

  /**
   * PATCH /admin/leave/requests/{id}/cancel — withdrawal by the applicant.
   *
   * Separate from review: that endpoint takes leave:review and only accepts
   * APPROVED/REJECTED. Only a PENDING request can be withdrawn, and only your
   * own.
   */
  async cancel(id: string): Promise<LeaveRequestDto> {
    const { data } = await apiClient.patch<ApiResponse<LeaveRequestDto>>(
      `/admin/leave/requests/${id}/cancel`,
    );
    return data.data;
  },

  async review(id: string, payload: ReviewLeaveRequestPayload): Promise<LeaveRequestDto> {
    const { data } = await apiClient.patch<ApiResponse<LeaveRequestDto>>(
      `/admin/leave/requests/${id}/review`,
      payload,
    );
    return data.data;
  },

  async calendar(params: LeaveCalendarQuery): Promise<LeaveCalendarEntryDto[]> {
    const { data } = await apiClient.get<ApiResponse<LeaveCalendarEntryDto[]>>(
      "/admin/leave/calendar",
      { params: cleanParams(params) },
    );
    return data.data;
  },
};
