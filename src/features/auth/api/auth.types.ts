import { StoredAdmin } from "@/lib/auth-session";

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  admin: StoredAdmin;
}

export interface AdminForgotPasswordRequest {
  email: string;
}

export interface AdminResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AcceptAdminInvitationRequest {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface AdminInvitationDetails {
  email: string;
  role: StoredAdmin["role"];
  expiresAt: string;
}

export interface AdminMe extends StoredAdmin {
  isActive: boolean;
  department: { id: string; name: string } | null;
  manager: { id: string; firstName: string | null; lastName: string | null } | null;
  permissions: string[];
}

