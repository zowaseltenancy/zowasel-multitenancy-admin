"use client";

import { useMemo } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import {
  CreatePlatformUserPayload,
  PlatformUsersQuery,
  platformUserKeys,
  platformUsersApi,
} from "../api/platform-users.api";
import { mapPlatformUser, mapPlatformUserDetail } from "../api/platform-users.mappers";

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
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: platformUserKeys.list(params),
    queryFn: () => platformUsersApi.list(params),
    // Filtering and paging are part of the key, so each change is a new query
    // with no cached data. Holding the previous page keeps the table on screen
    // instead of collapsing to its empty state on every keystroke.
    placeholderData: keepPreviousData,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: platformUserKeys.all });
  };

  const createUser = useMutation({
    mutationFn: (payload: CreatePlatformUserPayload) => platformUsersApi.create(payload),
    onSuccess: invalidate,
  });

  const setActive = useMutation({
    mutationFn: ({ id, isActive, reason }: { id: string; isActive: boolean; reason?: string }) =>
      platformUsersApi.setActive(id, isActive, reason),
    onSuccess: invalidate,
  });

  const setSuspended = useMutation({
    mutationFn: ({ id, isSuspended, reason }: { id: string; isSuspended: boolean; reason?: string }) =>
      platformUsersApi.setSuspended(id, isSuspended, reason),
    onSuccess: invalidate,
  });

  const unlock = useMutation({
    mutationFn: (id: string) => platformUsersApi.unlock(id),
    onSuccess: invalidate,
  });

  const dtos = useMemo(() => query.data?.items ?? [], [query.data]);

  return {
    /** Raw DTOs, for callers that want the account flags unflattened. */
    users: dtos,
    /** The same rows in the shape the user screens are written against. */
    mapped: useMemo(() => dtos.map(mapPlatformUser), [dtos]),
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load users.") : null,

    /**
     * POST /admin/users. The dialog closes on the server's answer, not on the
     * click — a duplicate email is a 409 and the operator needs the form back
     * with what they typed still in it.
     */
    create: (
      payload: CreatePlatformUserPayload,
      options?: { onSuccess?: () => void },
    ) =>
      createUser.mutate(payload, {
        onSuccess: () => {
          toast.success("Account created. An invitation to set a password has been emailed.");
          options?.onSuccess?.();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Unable to create that account.")),
      }),

    isCreating: createUser.isPending,

    /** The account switch. Distinct from suspension — see the API client. */
    setActive: (id: string, isActive: boolean, reason?: string) =>
      setActive.mutate(
        { id, isActive, ...(reason ? { reason } : {}) },
        {
          onSuccess: () => toast.success(isActive ? "User reactivated." : "User deactivated."),
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to change that user's status.")),
        },
      ),

    setSuspended: (id: string, isSuspended: boolean, reason?: string) =>
      setSuspended.mutate(
        { id, isSuspended, ...(reason ? { reason } : {}) },
        {
          onSuccess: () => toast.success(isSuspended ? "User suspended." : "Suspension lifted."),
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to change that user's suspension.")),
        },
      ),

    /** Clears a failed-sign-in lockout; not the same as lifting a suspension. */
    unlock: (id: string) =>
      unlock.mutate(id, {
        onSuccess: () => toast.success("Account unlocked."),
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to unlock that account.")),
      }),

    isMutating:
      createUser.isPending || setActive.isPending || setSuspended.isPending || unlock.isPending,
  };
}

/** One user with their profile and business memberships, from GET /admin/users/{id}. */
export function usePlatformUser(id: string | undefined) {
  const query = useQuery({
    queryKey: platformUserKeys.detail(id ?? ""),
    queryFn: () => platformUsersApi.detail(id as string),
    enabled: Boolean(id),
  });

  return {
    dto: query.data,
    user: query.data ? mapPlatformUserDetail(query.data) : undefined,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load this user.") : null,
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
