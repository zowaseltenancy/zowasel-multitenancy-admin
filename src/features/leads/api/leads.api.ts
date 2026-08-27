import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  ConvertLeadRequest,
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

  async updateStage(id: string, payload: UpdateLeadStageRequest) {
    const { data } = await apiClient.patch<ApiResponse<LeadDto>>(`/admin/leads/${id}/stage`, payload);
    return data.data;
  },

  async convert(id: string, payload: ConvertLeadRequest) {
    const { data } = await apiClient.post<ApiResponse<LeadDto>>(`/admin/leads/${id}/convert`, payload);
    return data.data;
  },
};

