import apiClient from "@/lib/axios";
import { ApiResponse } from "@/lib/api-response";
import {
  AdminActivityEntry,
  AdminActivityQuery,
  AdminActivityResult,
} from "./activity.types";

export const activityKeys = {
  all: ["admin-activity"] as const,
  list: (query: AdminActivityQuery) => [...activityKeys.all, query] as const,
};

export const activityApi = {
  async list(params: AdminActivityQuery = {}): Promise<AdminActivityResult> {
    const { data } = await apiClient.get<ApiResponse<AdminActivityEntry[]>>("/admin/activity", {
      params: Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
      ),
    });
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
