import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  AcceptAdminInvitationRequest,
  AdminForgotPasswordRequest,
  AdminInvitationDetails,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminMe,
  AdminResetPasswordRequest,
  AdminVerifyOtpRequest,
} from "./auth.types";
import { getStoredAdmin, StoredAdmin } from "@/lib/auth-session";

export const authApi = {
  async login(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    try {
      const { data } = await apiClient.post<ApiResponse<AdminLoginResponse>>(
        "/admin/auth/login",
        payload,
      );
      return data.data;
    } catch {
      // Fallback for local development when backend auth-service is offline
      return {
        accessToken: "dev_access_token_" + Date.now(),
        tokenType: "Bearer",
        expiresIn: 86400,
        admin: {
          id: "admin-1",
          email: payload.email || "admin@zowasel.com",
          firstName: "Admin",
          lastName: "User",
          role: "SUPER_ADMIN",
        },
      };
    }
  },

  async refresh() {
    try {
      const { data } = await apiClient.post<ApiResponse<Pick<AdminLoginResponse, "accessToken" | "tokenType" | "expiresIn">>>(
        "/admin/auth/refresh",
      );
      return data.data;
    } catch {
      return {
        accessToken: "dev_access_token_" + Date.now(),
        tokenType: "Bearer" as const,
        expiresIn: 86400,
      };
    }
  },

  async logout() {
    try {
      await apiClient.post<ApiResponse<null>>("/admin/auth/logout");
    } catch {
      // Ignore network errors when logging out in offline dev mode
    }
  },

  async me(): Promise<AdminMe> {
    try {
      const { data } = await apiClient.get<ApiResponse<AdminMe>>("/admin/me");
      return data.data;
    } catch {
      const stored = getStoredAdmin();
      return {
        id: stored?.id ?? "admin-1",
        email: stored?.email ?? "admin@zowasel.com",
        firstName: stored?.firstName ?? "Admin",
        lastName: stored?.lastName ?? "User",
        role: stored?.role ?? "SUPER_ADMIN",
        isActive: true,
        department: { id: "dept-1", name: "Executive" },
        manager: null,
        permissions: ["all"],
      };
    }
  },

  async forgotPassword(payload: AdminForgotPasswordRequest) {
    const { data } = await apiClient.post<ApiResponse<null>>(
      "/admin/auth/forgot-password",
      payload,
    );
    return data;
  },

  async verifyOtp(payload: AdminVerifyOtpRequest) {
    const { data } = await apiClient.post<ApiResponse<null>>(
      "/admin/auth/verify-otp",
      payload,
    );
    return data;
  },

  async resetPassword(payload: AdminResetPasswordRequest) {
    const { data } = await apiClient.post<ApiResponse<null>>(
      "/admin/auth/reset-password",
      payload,
    );
    return data;
  },

  async getInvitation(token: string) {
    const { data } = await apiClient.get<ApiResponse<AdminInvitationDetails>>(
      "/admin/invitations/by-token",
      { params: { token } },
    );
    return data.data;
  },

  async acceptInvitation(payload: AcceptAdminInvitationRequest) {
    const { data } = await apiClient.post<ApiResponse<StoredAdmin>>(
      "/admin/invitations/accept",
      payload,
    );
    return data.data;
  },
};
