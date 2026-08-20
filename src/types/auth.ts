import { UserRole } from "./permissions";
import { KybStatus } from "./kyb";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  businessId?: string;
  organizationId?: string;
  kybStatus?: KybStatus;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: AuthSession;
  requiresOtp?: boolean;
  tempToken?: string;
}

export interface PasswordResetPayload {
  email: string;
  token?: string;
}
