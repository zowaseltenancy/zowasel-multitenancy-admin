// ── Axios Client Factory — Multi-Service API Gateway ──────────────────────────
//
// In DEVELOPMENT  : Next.js rewrites (next.config.ts) proxy each /api/<service>/*
//                   prefix to the matching local microservice port. No Nginx needed.
//
// In PRODUCTION   : All requests go to the single public gateway
//                   (NEXT_PUBLIC_GATEWAY_URL_PRODUCTION / NEXT_PUBLIC_API_URL).
//
// Usage:
//   import { authClient }    from '@/lib/axios';   // → auth-service   :4000
//   import { userClient }    from '@/lib/axios';   // → user-service   :4001
//   import { billingClient } from '@/lib/axios';   // → billing-service :4004
//   import { paymentClient } from '@/lib/axios';   // → payment-service :4005
//   import { walletClient }  from '@/lib/axios';   // → wallet-service  :4003
//   import { notifClient }   from '@/lib/axios';   // → notification-service :4002

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import {
  clearAdminSession,
  getAdminAccessToken,
  setAdminAccessToken,
} from "@/lib/auth-session";
import { ApiResponse } from "@/lib/api-response";

// ── Environment ───────────────────────────────────────────────────────────────

const APP_ENV =
  process.env.NEXT_PUBLIC_APP_ENV ?? process.env.NODE_ENV ?? "development";

const IS_PRODUCTION = APP_ENV === "production";

// Every backend mounts its router at /api/v1 and the gateway routes on that
// prefix. In development the Next rewrite adds it (see next.config.ts); in
// production it has to be on the base URL.
const API_VERSION_PREFIX = "/api/v1";

/**
 * Resolve the base URL for a given service.
 *
 * Development  → relative path (e.g. "/api/auth") so the Next.js dev-server
 *               rewrites proxy the request to the correct local port, adding
 *               the /api/v1 prefix on the way.
 * Production   → absolute gateway URL including /api/v1
 *               (e.g. "https://gateway.zowasel.com/api/v1"). The gateway routes
 *               by resource path, so the per-service prefix is dev-only.
 */
function resolveBase(devPath: string): string {
  if (!IS_PRODUCTION) {
    // Relative — Next.js rewrite handles it (see next.config.ts)
    return devPath;
  }

  // Production: single public gateway. The /api/v1 prefix is part of the
  // contract, not decoration — the gateway matches on `location /api/v1/...`
  // and forwards the path unchanged to a service that mounts there too, so a
  // base URL without it 404s at the very first hop.
  const gateway =
    process.env.NEXT_PUBLIC_GATEWAY_URL_PRODUCTION ??
    process.env.NEXT_PUBLIC_API_URL ??
    "https://gateway.zowasel.com";

  return `${gateway.replace(/\/+$/, "")}${API_VERSION_PREFIX}`;
}

// ── Per-service base URLs ─────────────────────────────────────────────────────

export const SERVICE_URLS = {
  auth:         resolveBase("/api/auth"),         // → :4000  (dev)
  user:         resolveBase("/api/user"),         // → :4001  (dev)
  notification: resolveBase("/api/notification"), // → :4002  (dev)
  wallet:       resolveBase("/api/wallet"),       // → :4003  (dev)
  billing:      resolveBase("/api/billing"),      // → :4004  (dev)
  payment:      resolveBase("/api/payment"),      // → :4005  (dev)
} as const;

// ── Session expiry ───────────────────────────────────────────────────────────

/** Where an expired session lands. Kept here so every caller agrees. */
export const LOGIN_PATH = "/login";

// Guards against a burst of parallel 401s each trying to navigate. The first
// one wins; the rest are already on their way out.
let redirectingToLogin = false;

/**
 * Ends the session and sends the browser to the login screen.
 *
 * Clearing the token alone is not enough: React Query keeps rendering whatever
 * it has cached, so the page sits there showing an error toast — which is
 * exactly the "it just stays and throws" behaviour this replaces. `?expired=1`
 * lets the login screen explain why the user is back there, and `next` brings
 * them home again afterwards.
 */
export function endSessionAndRedirect(): void {
  clearAdminSession();

  if (typeof window === "undefined" || redirectingToLogin) return;
  if (window.location.pathname.startsWith(LOGIN_PATH)) return;

  redirectingToLogin = true;
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  // A hard assign rather than the router: this can fire from anywhere,
  // including outside React, and it must also drop all in-memory query cache.
  window.location.assign(`${LOGIN_PATH}?expired=1&next=${next}`);
}

// ── Token refresh (shared, deduped) ──────────────────────────────────────────

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Refresh always hits the auth service
  const { data } = await authClient.post<ApiResponse<{ accessToken: string }>>(
    "/admin/auth/refresh",
  );
  setAdminAccessToken(data.data.accessToken);
  return data.data.accessToken;
}

// ── Client factory ────────────────────────────────────────────────────────────

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // Attach Bearer token on every request
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAdminAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Auto-refresh on 401
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      const status = error.response?.status;

      // A failed refresh, or a 401 on an already-retried request, means the
      // session is genuinely gone — there is nothing left to try.
      const refreshFailed =
        status === 401 && originalRequest?.url?.includes("/admin/auth/refresh");
      if (refreshFailed || (status === 401 && originalRequest?._retry)) {
        endSessionAndRedirect();
        return Promise.reject(error);
      }

      // Login is exempt: a 401 there means bad credentials, and bouncing the
      // user off the login page they are already on would be absurd.
      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest.url?.includes("/admin/auth/login")
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      } catch (refreshError) {
        // Refresh is the last line of defence; once it fails the only correct
        // move is out.
        endSessionAndRedirect();
        return Promise.reject(refreshError);
      }
    },
  );

  return client;
}

// ── Named service clients ─────────────────────────────────────────────────────

/** Auth service        — dev: /api/auth → :4000  | prod: gateway */
export const authClient = createClient(SERVICE_URLS.auth);

/** User service        — dev: /api/user → :4001  | prod: gateway */
export const userClient = createClient(SERVICE_URLS.user);

/** Notification service — dev: /api/notification → :4002 | prod: gateway */
export const notifClient = createClient(SERVICE_URLS.notification);

/** Wallet service      — dev: /api/wallet → :4003 | prod: gateway */
export const walletClient = createClient(SERVICE_URLS.wallet);

/** Billing service     — dev: /api/billing → :4004 | prod: gateway */
export const billingClient = createClient(SERVICE_URLS.billing);

/** Payment service     — dev: /api/payment → :4005 | prod: gateway */
export const paymentClient = createClient(SERVICE_URLS.payment);

/**
 * Default export — auth client (backward-compatible with existing imports of
 * `apiClient` / `default`).
 */
export const apiClient = authClient;
export default authClient;

// ── Error helper ──────────────────────────────────────────────────────────────

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
