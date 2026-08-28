"use client";

import { useQuery } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/lib/axios";
import {
  PlatformUsersQuery,
  platformUserKeys,
  platformUsersApi,
} from "../api/platform-users.api";

/**
 * End users across every tenant, from GET /admin/users.
 *
 * Deliberately separate from the existing `useUsers`, which is still mock: that
 * hook's `PlatformUser` shape carries fields the API has no source for
 * (buyerTier, agentMeta, userCategory, gender, and the geographic scope the
 * dashboard filters on), and the category screens read them. Rather than
 * fabricate those, this exposes only what the endpoint really returns.
 */
export function usePlatformUsers(params: PlatformUsersQuery = { page: 1, limit: 100 }) {
  const query = useQuery({
    queryKey: platformUserKeys.list(params),
    queryFn: () => platformUsersApi.list(params),
  });

  return {
    users: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load users.") : null,
  };
}

/** Platform-wide user counts, from GET /admin/users/stats. */
export function usePlatformUserStats() {
  const query = useQuery({
    queryKey: platformUserKeys.stats(),
    queryFn: platformUsersApi.stats,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load user stats.") : null,
  };
}
