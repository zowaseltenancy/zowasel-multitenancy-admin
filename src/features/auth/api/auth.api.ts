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
import { StoredAdmin } from "@/lib/auth-session";

export const authApi = {
  async login(payload: AdminLoginRequest) {
    const { data } = await apiClient.post<ApiResponse<AdminLoginResponse>>(
      "/admin/auth/login",
      payload,
    );
    return data.data;
  },

  async refresh() {
    const { data } = await apiClient.post<ApiResponse<Pick<AdminLoginResponse, "accessToken" | "tokenType" | "expiresIn">>>(
      "/admin/auth/refresh",
    );
    return data.data;
  },

  async logout() {
    await apiClient.post<ApiResponse<null>>("/admin/auth/logout");
  },

  async me() {
    const { data } = await apiClient.get<ApiResponse<AdminMe>>("/admin/me");
    return data.data;
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
