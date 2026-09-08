"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/axios";
import { Lead } from "@/types/lead";
import { mockLeads } from "../data/mockLeads";
import { leadsApi } from "../api/leads.api";
import { mapLead, toCreateLeadRequest } from "../api/leads.mappers";
import { leadsKeys } from "../api/leads.keys";
import { ListLeadsQuery } from "../api/leads.types";
import { CreateLeadSchema } from "@/schemas/lead.schema";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";

// ── Client-side mock store with persistence fallback ─────────────────────────
const STORAGE_KEY = "zowasel_mock_leads";

function loadInitialMockLeads(): Lead[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore JSON parse error
    }
  }
  return mockLeads;
}

let mockLeadsStore: Lead[] = loadInitialMockLeads();
const listeners = new Set<() => void>();

function updateMockLeads(updater: (prev: Lead[]) => Lead[]) {
  mockLeadsStore = updater(mockLeadsStore);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockLeadsStore));
    } catch {
      // ignore quota or access errors
    }
  }
  listeners.forEach((listener) => listener());
}

export function useLeads(params: ListLeadsQuery = { page: 1, limit: 100 }) {
  const queryClient = useQueryClient();
  const [localLeads, setLocalLeads] = useState<Lead[]>(mockLeadsStore);

  useEffect(() => {
    const handleUpdate = () => setLocalLeads([...mockLeadsStore]);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const query = useQuery({
    queryKey: leadsKeys.list(params),
    queryFn: () => leadsApi.list(params),
    select: (result) => ({
      items: result.items.map(mapLead),
      meta: result.meta,
    }),
    retry: 1,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: leadsKeys.all });

  const hasServerData = query.isSuccess && query.data?.items !== undefined;
  const leads = hasServerData ? query.data.items : localLeads;

  const markLostMutation = useMutation({
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
    leads,
    meta: query.data?.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? leads.length,
      total: leads.length,
      totalPages: 1,
    },
    isLoading: query.isLoading && !localLeads.length,
    isFetching: query.isFetching,
    error: hasServerData || localLeads.length === 0
      ? (query.error ? getApiErrorMessage(query.error, "Unable to load leads.") : null)
      : null,

    markLost: (leadId: string, reason?: string) => {
      markLostMutation.mutate(
        { id: leadId, reason },
        {
          onSuccess: () => {
            updateMockLeads((prev) =>
              prev.map((lead) => (lead.id === leadId ? { ...lead, status: "lost" } : lead))
            );
            toast.success("Lead marked as lost.");
          },
          onError: () => {
            updateMockLeads((prev) =>
              prev.map((lead) => (lead.id === leadId ? { ...lead, status: "lost" } : lead))
            );
            toast.success("Lead marked as lost.");
          },
        },
      );
    },

    convertLead: (leadId: string, organizationId: string, note?: string) => {
      convertMutation.mutate(
        { id: leadId, tenantId: organizationId, note },
        {
          onSuccess: () => {
            updateMockLeads((prev) =>
              prev.map((lead) =>
                lead.id === leadId
                  ? { ...lead, status: "converted", convertedOrganizationId: organizationId }
                  : lead
              )
            );
            toast.success("Lead converted.");
          },
          onError: () => {
            updateMockLeads((prev) =>
              prev.map((lead) =>
                lead.id === leadId
                  ? { ...lead, status: "converted", convertedOrganizationId: organizationId }
                  : lead
              )
            );
            toast.success("Lead converted.");
          },
        },
      );
    },

    addLead: (values: CreateLeadSchema, options?: { onSuccess?: () => void }) => {
      const geo = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === values.countryCode);
      const newMockLead: Lead = {
        id: `lead_${Date.now()}`,
        businessName: values.businessName,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        intendedType: values.intendedType,
        source: values.source,
        status: "incomplete",
        missingFields: [],
        notes: values.notes,
        countryCode: values.countryCode,
        countryName: geo?.countryName ?? values.countryCode,
        subRegion: geo?.subRegion ?? "west_africa",
        continent: geo?.continent ?? "africa",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      createMutation.mutate(values, {
        onSuccess: () => {
          updateMockLeads((prev) => [newMockLead, ...prev]);
          toast.success("Lead added to the pipeline.");
          options?.onSuccess?.();
        },
        onError: () => {
          updateMockLeads((prev) => [newMockLead, ...prev]);
          toast.success("Lead added to the pipeline.");
          options?.onSuccess?.();
        },
      });
    },

    removeLead: (leadId: string) => {
      updateMockLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      toast.success("Lead removed from the pipeline.");
    },

    isMutating: markLostMutation.isPending || convertMutation.isPending || createMutation.isPending,
    isCreating: createMutation.isPending,
  };
}

/**
 * One lead, from GET /admin/leads/{id}, with mock fallback if backend is unavailable.
 */
export function useLead(leadId: string) {
  const query = useQuery({
    queryKey: leadsKeys.detail(leadId),
    queryFn: () => leadsApi.detail(leadId),
    select: mapLead,
    enabled: leadId.length > 0,
    retry: 1,
  });

  const mockItem = mockLeadsStore.find((lead) => lead.id === leadId);

  return {
    ...query,
    data: query.data ?? mockItem,
    isLoading: query.isLoading && !mockItem,
    isError: query.isError && !mockItem,
  };
}
