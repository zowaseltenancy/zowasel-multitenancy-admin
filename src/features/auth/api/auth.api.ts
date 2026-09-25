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
  /**
   * Failures propagate. There is deliberately no offline fallback here.
   *
   * This used to catch everything and return a synthetic
   * `dev_access_token_<timestamp>` with a fabricated SUPER_ADMIN admin. The
   * effect was that any backend problem — a 500, a network drop, a bad
   * response shape — looked like a successful sign-in: the fake token was
   * written to localStorage, the login page navigated to /admin, and
   * RequireAdminAuth let it through because a token was present. Every
   * dashboard request then 401'd, the refresh 401'd too, and the interceptor
   * bounced the user to /login?expired=1&next=%2Fadmin — an inescapable loop
   * for as long as the backend was unwell, with no message saying why.
   *
   * Letting the error through instead means the login form shows what actually
   * went wrong and no session is stored.
   */
  async login(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    const { data } = await apiClient.post<ApiResponse<AdminLoginResponse>>(
      "/admin/auth/login",
      payload,
    );
    return data.data;
  },

  /**
   * Also no fallback. A synthetic token here was worse than a failed refresh:
   * it made the interceptor believe the session had been renewed, so it
   * retried the original request with another unusable token and only gave up
   * on the second 401 — turning a clean "your session expired" into two
   * rounds of failures first.
   */
  async refresh() {
    const { data } = await apiClient.post<
      ApiResponse<Pick<AdminLoginResponse, "accessToken" | "tokenType" | "expiresIn">>
    >("/admin/auth/refresh");
    return data.data;
  },

  async logout() {
    try {
      await apiClient.post<ApiResponse<null>>("/admin/auth/logout");
    } catch {
      // Ignore network errors when logging out in offline dev mode
    }
  },

  /**
   * No fallback, and this one mattered most: it returned
   * `permissions: ["all"]` and `role: "SUPER_ADMIN"` for a session the server
   * had just rejected. Every permission-gated control in the console would
   * render for someone whose token was dead — and any write they attempted
   * would 401. A failed identity check has to read as failed.
   */
  async me(): Promise<AdminMe> {
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
