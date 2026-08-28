import { userClient } from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";

// ── KYB review ───────────────────────────────────────────────────────────────
// KYB is owned by user-service, not auth-service — the businesses endpoints in
// auth-service deliberately never touch kybStatus. So this goes through
// userClient (dev: /api/user -> :4001), not the default auth client.
//
// PATCH /kyb/{tenantId}/review, gated to SUPER_ADMIN / ADMIN.

export type KybReviewAction = "approve" | "reject";

export interface KybReviewPayload {
  action: KybReviewAction;
  /** Server requires at least 10 characters when supplied. */
  reason?: string;
}

export const kybApi = {
  async review(tenantId: string, payload: KybReviewPayload): Promise<void> {
    await userClient.patch<ApiResponse<null>>(`/kyb/${tenantId}/review`, payload);
  },
};
