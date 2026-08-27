import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  CreateStaffPayload,
  DepartmentDto,
  StaffDto,
  StaffListQuery,
  StaffListResult,
  StaffStatus,
  StaffSystemRole,
  UpdateStaffPayload,
} from "./staff.types";

function cleanParams(params: StaffListQuery) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== "all",
    ),
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

  /** Departments are what the directory filters by, so they load alongside it. */
  async departments(): Promise<DepartmentDto[]> {
    const { data } = await apiClient.get<ApiResponse<DepartmentDto[]>>("/admin/departments", {
      params: { limit: 100 },
    });
    return data.data;
  },
};
