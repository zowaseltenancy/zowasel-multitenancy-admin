"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import { Lead } from "@/types/lead";
import { leadsApi } from "../api/leads.api";
import { mapLead, toCreateLeadRequest } from "../api/leads.mappers";
import { leadsKeys } from "../api/leads.keys";
import { ListLeadsQuery } from "../api/leads.types";
import { CreateLeadSchema } from "@/schemas/lead.schema";

// Backed by GET /admin/leads. Replaces a useState(mockLeads) hook whose
// mutators only ever edited local component state — the pipeline looked like it
// was saving and silently wasn't.
//
// The return shape is unchanged so existing consumers keep working, but two of
// the old mutators have no endpoint behind them; see addLead/removeLead below.

export function useLeads(params: ListLeadsQuery = { page: 1, limit: 100 }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: leadsKeys.list(params),
    queryFn: () => leadsApi.list(params),
    select: (result) => ({
      items: result.items.map(mapLead),
      meta: result.meta,
    }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: leadsKeys.all });

  const markLostMutation = useMutation({
    // The service requires a disqualificationReason whenever a lead lands on
    // CLOSED_LOST — it refuses the transition without one, since a dead lead
    // with no recorded reason is useless for pipeline analysis. Callers that
    // don't collect one get a factual placeholder rather than a 422.
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      leadsApi.updateStage(id, {
        stage: "CLOSED_LOST",
        status: "DISQUALIFIED",
        disqualificationReason: reason?.trim() || "Marked lost from the admin console",
      }),
    onSuccess: invalidate,
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateLeadSchema) => leadsApi.create(toCreateLeadRequest(values)),
    onSuccess: invalidate,
  });

  const convertMutation = useMutation({
    mutationFn: ({ id, tenantId, note }: { id: string; tenantId: string; note?: string }) =>
      leadsApi.convert(id, { tenantId, note }),
    onSuccess: invalidate,
  });

  return {
    leads: query.data?.items ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error ? getApiErrorMessage(query.error, "Unable to load leads.") : null,

    markLost: (leadId: string, reason?: string) => {
      markLostMutation.mutate(
        { id: leadId, reason },
        {
          onSuccess: () => toast.success("Lead marked as lost."),
          onError: (error) => toast.error(getApiErrorMessage(error, "Unable to mark the lead lost.")),
        },
      );
    },

    convertLead: (leadId: string, organizationId: string, note?: string) => {
      convertMutation.mutate(
        { id: leadId, tenantId: organizationId, note },
        {
          onSuccess: () => toast.success("Lead converted."),
          onError: (error) => toast.error(getApiErrorMessage(error, "Unable to convert the lead.")),
        },
      );
    },

    // POST /admin/leads. The form now collects the classification-specific
    // metadata the endpoint requires — see toCreateLeadRequest for how the
    // UI's four intended types fold into the API's three.
    addLead: (values: CreateLeadSchema, options?: { onSuccess?: () => void }) => {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Lead added to the pipeline.");
          options?.onSuccess?.();
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Unable to add the lead.")),
      });
    },

    // There is no DELETE /admin/leads/{id}. Leads are closed or disqualified,
    // never deleted, so the pipeline keeps its history. Use markLost instead.
    removeLead: (_leadId: string) => {
      toast.error("Leads can't be deleted — mark the lead lost instead.");
    },

    isMutating: markLostMutation.isPending || convertMutation.isPending || createMutation.isPending,
    isCreating: createMutation.isPending,
  };
}

/**
 * One lead, from GET /admin/leads/{id}.
 *
 * The detail view previously searched the *list* for its lead, which meant it
 * could only ever show a lead that happened to be on the fetched page — and the
 * route above it 404'd real UUIDs against the mock array before that even ran.
 */
export function useLead(leadId: string) {
  return useQuery({
    queryKey: leadsKeys.detail(leadId),
    queryFn: () => leadsApi.detail(leadId),
    select: mapLead,
    enabled: leadId.length > 0,
  });
}
