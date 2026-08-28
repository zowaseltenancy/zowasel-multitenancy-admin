"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import { AssignedStaffMember, Organization } from "@/types/organization";
import { kybApi } from "@/features/kyb/api/kyb.api";
import { organizationApi } from "../api/organization.api";
import { organizationKeys } from "../api/organization.keys";
import { mapBusinessDetail, mapBusinessListItem } from "../api/organization.mappers";
import { BusinessListQuery, BusinessMembersQuery } from "../api/organization.types";

// Backed by GET /admin/businesses. This replaced a useState(mockOrganizations)
// hook: the list, the KYB decisions and every "save" were local array edits, so
// nothing reached the server and a page refresh undid it all.
//
// The mutators that survive are the ones with an endpoint behind them. The rest
// now say so rather than silently editing state — see the bottom of the return.

const DEFAULT_LIST: BusinessListQuery = { page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" };

export function useOrganizations(params: BusinessListQuery = DEFAULT_LIST) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationApi.list(params),
    select: (result) => ({
      items: result.items.map(mapBusinessListItem),
      meta: result.meta,
    }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: organizationKeys.all });

  // PATCH /kyb/{tenantId}/review in user-service — auth-service's business
  // endpoints deliberately never touch kybStatus.
  const applyKybDecision = async (
    organizationId: string,
    action: "approve" | "reject",
    reason?: string,
  ) => {
    try {
      await kybApi.review(organizationId, { action, ...(reason ? { reason } : {}) });
      toast.success(action === "approve" ? "KYB approved." : "KYB rejected.");
      invalidate();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to record the KYB decision."));
    }
  };

  // Accepts and ignores any arguments — these stand in for mutators whose
  // call signatures already exist across the UI.
  const notAvailable = (what: string) => (..._args: unknown[]) => {
    toast.error(`${what} isn't available yet — there's no endpoint for it.`);
  };

  return {
    organizations: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load organizations.") : null,

    approveKyb: (organizationId: string) => {
      void applyKybDecision(organizationId, "approve");
    },

    rejectKyb: (organizationId: string, reason: string) => {
      // The endpoint requires at least 10 characters when a reason is supplied.
      const trimmed = reason.trim();
      void applyKybDecision(
        organizationId,
        "reject",
        trimmed.length >= 10 ? trimmed : `Rejected by admin: ${trimmed || "no reason given"}`,
      );
    },

    // The review endpoint only accepts approve|reject — there is no way to send
    // a business back to PENDING once it has been decided.
    markKybPending: notAvailable("Reverting KYB to pending"),

    // No endpoint: tenantOfficers, the primary/secondary staff columns and the
    // team-member records are all readable but have no admin write route yet.
    updateTeamMember: notAvailable("Editing team members"),
    removeTeamMember: notAvailable("Removing team members"),
    toggleKeyOfficerStatus: notAvailable("Toggling officer status"),
    addOrganization: notAvailable("Creating organizations from the admin console"),
    assignStaff: (
      _organizationId: string,
      _slot: "primary" | "secondary",
      _member: AssignedStaffMember | null,
    ) => {
      toast.error("Assigning staff isn't available yet — there's no endpoint for it.");
    },
    swapAssignedStaff: notAvailable("Swapping assigned staff"),
  };
}

/** One business, from GET /admin/businesses/{id}. */
export function useOrganization(organizationId: string) {
  return useQuery({
    queryKey: organizationKeys.detail(organizationId),
    queryFn: () => organizationApi.detail(organizationId),
    select: mapBusinessDetail,
    enabled: organizationId.length > 0,
  });
}

/** Platform-wide business counts, from GET /admin/businesses/stats. */
export function useOrganizationStats() {
  const query = useQuery({
    queryKey: organizationKeys.stats(),
    queryFn: organizationApi.stats,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load business stats.") : null,
  };
}

/**
 * Team members for one business — the paginated, filterable view. The detail
 * response also carries an inline `teamMembers` array; this is for screens that
 * need to filter, notably the agents tab.
 */
export function useOrganizationMembers(organizationId: string, params: BusinessMembersQuery = {}) {
  const query = useQuery({
    queryKey: [...organizationKeys.detail(organizationId), "members", params],
    queryFn: () => organizationApi.members(organizationId, params),
    enabled: organizationId.length > 0,
  });

  return {
    members: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load team members.") : null,
  };
}

/** End-user accounts attached to this business (GET /admin/users?tenantId=). */
export function useOrganizationUsers(
  organizationId: string,
  params: { page?: number; limit?: number; search?: string } = {},
) {
  const query = useQuery({
    queryKey: [...organizationKeys.detail(organizationId), "users", params],
    queryFn: () => organizationApi.users(organizationId, params),
    enabled: organizationId.length > 0,
  });

  return {
    users: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load users.") : null,
  };
}

/**
 * Field agents are TenantMembers holding the FIELD_AGENT role — not a separate
 * table — so this is the members query with one filter applied.
 */
export function useOrganizationFieldAgents(organizationId: string) {
  const { members, isLoading, isFetching, error } = useOrganizationMembers(organizationId, {
    role: "FIELD_AGENT",
    limit: 100,
  });
  return { agents: members, isLoading, isFetching, error };
}

export type { Organization };
