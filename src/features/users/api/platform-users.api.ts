import apiClient from "@/lib/axios";
import { ApiMeta, ApiResponse } from "@/lib/api-response";

// ── Platform users ───────────────────────────────────────────────────────────
// GET /admin/users — the end users (farmers, merchants, buyers) across every
// tenant. Distinct from GET /admin/staff, which serves Zowasel's own staff out
// of the separate `admins` table.

export interface PlatformUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
  isLocked: boolean;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  roles: string[];
  tenantCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PlatformUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  tenantId?: string;
  isActive?: boolean;
  isSuspended?: boolean;
  role?: string;
}

export interface PlatformUsersResult {
  items: PlatformUserDto[];
  meta: ApiMeta;
}

export interface PlatformUserStatsDto {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  suspended: number;
  locked: number;
  deleted: number;
  byRole: Array<{ value: string | null; count: number }>;
  createdLast30Days: number;
}

export const platformUserKeys = {
  all: ["platform-users"] as const,
  list: (params: PlatformUsersQuery) => [...platformUserKeys.all, "list", params] as const,
  stats: () => [...platformUserKeys.all, "stats"] as const,
};

function clean(params: PlatformUsersQuery) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all"),
  );
}

export const platformUsersApi = {
  async list(params: PlatformUsersQuery = {}): Promise<PlatformUsersResult> {
    const { data } = await apiClient.get<ApiResponse<PlatformUserDto[]>>("/admin/users", {
      params: clean(params),
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

  async stats(): Promise<PlatformUserStatsDto> {
    const { data } = await apiClient.get<ApiResponse<PlatformUserStatsDto>>("/admin/users/stats");
    return data.data;
  },
};
