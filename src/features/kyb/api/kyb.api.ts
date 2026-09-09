import apiClient, { userClient } from "@/lib/axios";
import { ApiResponse, ApiMeta } from "@/lib/api-response";

// ── KYB review ───────────────────────────────────────────────────────────────
// The decision goes to user-service, which owns the kybDocuments table —
// auth-service's businesses endpoints deliberately never touch kybStatus. So
// review() goes through userClient (dev: /api/user -> :4001).
//
// Reads go the other way. auth-service mirrors kybDocuments read-only, and its
// GET /kyb/{tenantId} in user-service requires *membership*, which a platform
// admin does not have — so the queue is read from auth-service instead.

export type KybReviewAction = "approve" | "reject" | "pending";

export interface KybReviewPayload {
  action: KybReviewAction;
  /** Required when rejecting; the server needs at least 10 characters. */
  reason?: string;
}

// ── Document review queue ────────────────────────────────────────────────────
// GET /admin/kyb/documents. One row per document rather than per business:
// GET /admin/businesses carries no documents at all (a business can have a
// dozen, and the directory would pay for them on every page), which is why
// the review screen used to render an empty table.

export interface KybDocumentQueueItemDto {
  id: string;
  type: string;
  url: string;
  filename: string | null;
  status: string;
  uploadedAt: string;
  reviewedAt: string | null;
  business: {
    id: string;
    businessId: string;
    name: string;
    kybStatus: string;
    kybSubmittedAt: string | null;
    ownerName: string | null;
    ownerEmail: string | null;
  };
}

export interface KybDocumentsQuery {
  page?: number;
  limit?: number;
  /** Status of the *business*. The review queue is "PENDING". */
  kybStatus?: string;
  /** Status of the individual document — a different question. */
  docStatus?: string;
  search?: string;
  /** Location hierarchy of the owning business. These compose server-side. */
  continent?: string;
  subRegion?: string;
  country?: string;
}

export interface KybDocumentsResult {
  items: KybDocumentQueueItemDto[];
  meta: ApiMeta;
}

function cleanParams(params: KybDocumentsQuery) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "" && value !== "all",
    ),
  );
}

export const kybApi = {
  async review(tenantId: string, payload: KybReviewPayload): Promise<void> {
    await userClient.patch<ApiResponse<null>>(`/kyb/${tenantId}/review`, payload);
  },

  async documents(params: KybDocumentsQuery = {}): Promise<KybDocumentsResult> {
    const { data } = await apiClient.get<ApiResponse<KybDocumentQueueItemDto[]>>(
      "/admin/kyb/documents",
      { params: cleanParams(params) },
    );
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
};
