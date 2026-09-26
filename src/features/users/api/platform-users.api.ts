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

/** Profile fields, only returned by GET /admin/users/{id}. */
export interface PlatformUserProfileDto {
  phone: string | null;
  country: string | null;
  region: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  timezone: string | null;
  locale: string | null;
  dateOfBirth: string | null;
}

/** A business this user belongs to, with their role in it. */
export interface PlatformUserTenantDto {
  id: string;
  name: string;
  slug: string;
  kybStatus: string;
  isActive: boolean;
  memberRole: string;
  jobTitle: string | null;
  joinedAt: string;
  isOwner: boolean;
}

export interface PlatformUserDetailDto extends PlatformUserDto {
  profile: PlatformUserProfileDto | null;
  tenants: PlatformUserTenantDto[];
  failedLoginAttempts: number;
  activeSessionCount: number;
}

/**
 * What POST /admin/users accepts.
 *
 * No password field, deliberately: the account is created unusable and the
 * person sets their own from an emailed link. The endpoint validates strictly,
 * so sending one is a 422 rather than a field quietly ignored.
 */
export interface CreatePlatformUserPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  /** A role slug from the roles table — see toApiRoleSlug, not a display title. */
  role?: string;
  tenantId?: string;
  tenantRole?: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  jobTitle?: string;
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
  detail: (id: string) => [...platformUserKeys.all, "detail", id] as const,
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

  /**
   * POST /admin/users — provisions the account and emails the invitation.
   * Returns the created user with its profile and memberships.
   */
  async create(payload: CreatePlatformUserPayload): Promise<PlatformUserDetailDto> {
    const { data } = await apiClient.post<ApiResponse<PlatformUserDetailDto>>(
      "/admin/users",
      payload,
    );
    return data.data;
  },

  /** GET /admin/users/{id} — adds the profile and tenant memberships. */
  async detail(id: string): Promise<PlatformUserDetailDto> {
    const { data } = await apiClient.get<ApiResponse<PlatformUserDetailDto>>(`/admin/users/${id}`);
    return data.data;
  },

  async stats(): Promise<PlatformUserStatsDto> {
    const { data } = await apiClient.get<ApiResponse<PlatformUserStatsDto>>("/admin/users/stats");
    return data.data;
  },

  /**
   * Deactivating is not suspending: `isActive` is the account switch, while
   * `isSuspended` is an enforcement state the platform applies. They are
   * separate endpoints server-side and separate columns, so a screen that
   * conflated them would show one and write the other.
   */
  async setActive(id: string, isActive: boolean, reason?: string): Promise<PlatformUserDto> {
    const { data } = await apiClient.patch<ApiResponse<PlatformUserDto>>(
      `/admin/users/${id}/active`,
      { isActive, ...(reason ? { reason } : {}) },
    );
    return data.data;
  },

  async setSuspended(id: string, isSuspended: boolean, reason?: string): Promise<PlatformUserDto> {
    const { data } = await apiClient.patch<ApiResponse<PlatformUserDto>>(
      `/admin/users/${id}/suspend`,
      { isSuspended, ...(reason ? { reason } : {}) },
    );
    return data.data;
  },

  /** Clears a lockout from failed sign-in attempts. Not the same as unsuspending. */
  async unlock(id: string): Promise<PlatformUserDto> {
    const { data } = await apiClient.post<ApiResponse<PlatformUserDto>>(
      `/admin/users/${id}/unlock`,
    );
    return data.data;
  },
};
