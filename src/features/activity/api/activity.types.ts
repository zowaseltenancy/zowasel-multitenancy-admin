import { ApiMeta } from "@/lib/api-response";

// ── Admin console activity ───────────────────────────────────────────────────
// GET /admin/activity — what Zowasel staff did on this platform.
//
// NOT the same as the tenant-facing feeds: /auth/activity is a tenant user's
// own account history, and /admin/businesses/{id}/activity is one business's
// team activity. Those describe customers; this describes staff.

export type AdminActivityType =
  | "session"
  | "security"
  | "staff"
  | "business"
  | "users"
  | "leave"
  | "other";

export interface AdminActivityEntry {
  id: string;
  type: AdminActivityType;
  /** Raw audit key, e.g. "business.verified". */
  action: string;
  /** Human-readable label resolved server-side. */
  event: string;
  /** Null only for a failed sign-in, where the account was not identified. */
  actor: { id: string; name: string; email: string } | null;
  resource: string | null;
  resourceId: string | null;
  ipAddress: string | null;
  device: string | null;
  platform: string | null;
  city: string | null;
  country: string | null;
  status: "success" | "failure";
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminActivityQuery {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  from?: string;
  to?: string;
}

export interface AdminActivityResult {
  items: AdminActivityEntry[];
  meta: ApiMeta;
}
