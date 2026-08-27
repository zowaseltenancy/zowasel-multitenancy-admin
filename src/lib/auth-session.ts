export const ADMIN_ACCESS_TOKEN_KEY = "zowasel_admin_access_token";
export const ADMIN_USER_KEY = "zowasel_admin_user";
export const ADMIN_RESET_EMAIL_KEY = "zowasel_admin_reset_email";
export const ADMIN_RESET_OTP_KEY = "zowasel_admin_reset_otp";

export interface StoredAdmin {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
}

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getAdminAccessToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function setAdminAccessToken(token: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token);
}

export function clearAdminAccessToken(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY);
}

export function getStoredAdmin(): StoredAdmin | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAdmin;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin: StoredAdmin): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin));
}

export function clearStoredAdmin(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(ADMIN_USER_KEY);
}

export function clearAdminSession(): void {
  clearAdminAccessToken();
  clearStoredAdmin();
}

export function getResetEmail(): string {
  if (!canUseStorage()) return "";
  return window.sessionStorage.getItem(ADMIN_RESET_EMAIL_KEY) ?? "";
}

export function setResetEmail(email: string): void {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(ADMIN_RESET_EMAIL_KEY, email);
}

export function getResetOtp(): string {
  if (!canUseStorage()) return "";
  return window.sessionStorage.getItem(ADMIN_RESET_OTP_KEY) ?? "";
}

export function setResetOtp(otp: string): void {
  if (!canUseStorage()) return;
  window.sessionStorage.setItem(ADMIN_RESET_OTP_KEY, otp);
}

export function clearResetState(): void {
  if (!canUseStorage()) return;
  window.sessionStorage.removeItem(ADMIN_RESET_EMAIL_KEY);
  window.sessionStorage.removeItem(ADMIN_RESET_OTP_KEY);
}

