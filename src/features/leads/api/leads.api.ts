import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  ConvertLeadRequest,
  CreateLeadRequest,
  LeadDto,
  LeadsListResult,
  ListLeadsQuery,
  UpdateLeadStageRequest,
} from "./leads.types";

function cleanParams(params: ListLeadsQuery) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== "all"),
  );
}

export const leadsApi = {
  async list(params: ListLeadsQuery): Promise<LeadsListResult> {
    const { data } = await apiClient.get<ApiResponse<LeadDto[]>>(
      "/admin/leads",
      { params: cleanParams(params) },
    );
    return {
      items: data.data,
      meta: data.meta ?? { page: params.page ?? 1, limit: params.limit ?? data.data.length, total: data.data.length, totalPages: 1 },
    };
  },

  /** POST /admin/leads. Takes the classification-specific payload. */
  async create(payload: CreateLeadRequest): Promise<LeadDto> {
    const { data } = await apiClient.post<ApiResponse<LeadDto>>("/admin/leads", payload);
    return data.data;
  },

  /** GET /admin/leads/{id}. Row-scoped server-side by the caller's read scope. */
  async detail(id: string): Promise<LeadDto> {
    const { data } = await apiClient.get<ApiResponse<LeadDto>>(`/admin/leads/${id}`);
    return data.data;
  },

  async updateStage(id: string, payload: UpdateLeadStageRequest) {
    const { data } = await apiClient.patch<ApiResponse<LeadDto>>(`/admin/leads/${id}/stage`, payload);
    return data.data;
  },

  async convert(id: string, payload: ConvertLeadRequest) {
    const { data } = await apiClient.post<ApiResponse<LeadDto>>(`/admin/leads/${id}/convert`, payload);
    return data.data;
  },

  /**
   * DELETE /admin/leads/{id}. Permanent, and it takes the lead's timeline and
   * documents with it. The server refuses a converted lead — that record is
   * the attribution link behind a live business, not a pipeline row.
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/admin/leads/${id}`);
  },
};

