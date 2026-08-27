"use client";

import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/axios";
import { activityApi, activityKeys } from "../api/activity.api";
import { AdminActivityQuery } from "../api/activity.types";

/**
 * Recent activity on the admin console. Backed by GET /admin/activity, which
 * selects on the audit log's admin actor — so it shows what staff did, not what
 * tenants did.
 */
export function useAdminActivity(params: AdminActivityQuery = { page: 1, limit: 20 }) {
  const query = useQuery({
    queryKey: activityKeys.list(params),
    queryFn: () => activityApi.list(params),
    // The feed is a live-ish dashboard panel; a short stale window keeps it
    // current without hammering the endpoint on every remount.
    staleTime: 30_000,
  });

  return {
    activity: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load activity.") : null,
  };
}
