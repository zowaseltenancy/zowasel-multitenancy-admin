import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  BusinessDetailDto,
  BusinessListItemDto,
  BusinessListQuery,
  BusinessListResult,
  BusinessMemberDto,
  BusinessMembersQuery,
  BusinessMembersResult,
  BusinessStatsDto,
  TenantUserDto,
  TenantUsersResult,
} from "./organization.types";

function cleanParams(params: BusinessListQuery) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== "all"),
  );
}

export const organizationApi = {
  async list(params: BusinessListQuery): Promise<BusinessListResult> {
    const { data } = await apiClient.get<ApiResponse<BusinessListItemDto[]>>(
      "/admin/businesses",
      { params: cleanParams(params) },
    );
    return {
      items: data.data,
      meta: data.meta ?? { page: params.page ?? 1, limit: params.limit ?? data.data.length, total: data.data.length, totalPages: 1 },
    };
  },

  async stats() {
    const { data } = await apiClient.get<ApiResponse<BusinessStatsDto>>("/admin/businesses/stats");
    return data.data;
  },

  async detail(id: string) {
    const { data } = await apiClient.get<ApiResponse<BusinessDetailDto>>(`/admin/businesses/${id}`);
    return data.data;
  },

  /** Paginated team members. `role` narrows to e.g. FIELD_AGENT. */
  async members(id: string, params: BusinessMembersQuery = {}): Promise<BusinessMembersResult> {
    const { data } = await apiClient.get<ApiResponse<BusinessMemberDto[]>>(
      `/admin/businesses/${id}/members`,
      { params: cleanParams(params as BusinessListQuery) },
    );
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

  /** End-user accounts attached to this business. */
  async users(tenantId: string, params: { page?: number; limit?: number; search?: string } = {}): Promise<TenantUsersResult> {
    const { data } = await apiClient.get<ApiResponse<TenantUserDto[]>>("/admin/users", {
      params: cleanParams({ ...params, tenantId } as unknown as BusinessListQuery),
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

  async setVerified(id: string, isVerified: boolean, reason?: string) {
    const { data } = await apiClient.patch<ApiResponse<BusinessDetailDto>>(
      `/admin/businesses/${id}/verify`,
      { isVerified, reason },
    );
    return data.data;
  },
};
