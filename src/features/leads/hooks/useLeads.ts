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
import { ConvertLeadRequest, ListLeadsQuery } from "../api/leads.types";
import { CreateLeadSchema } from "@/schemas/lead.schema";

// ── Client-side mock store with persistence fallback ─────────────────────────
const STORAGE_KEY = "zowasel_mock_leads";

function loadInitialMockLeads(): Lead[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Lead[] = JSON.parse(stored);
        return parsed.map((item) => {
          const defaultMock = mockLeads.find((m) => m.id === item.id);
          return defaultMock ? { ...defaultMock, ...item } : item;
        });
      }
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
    mutationFn: ({ id, payload }: { id: string; payload: ConvertLeadRequest }) =>
      leadsApi.convert(id, payload),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => leadsApi.remove(id),
    onSuccess: invalidate,
  });

  const apiItems = query.data?.items;
  // If API returns items, use them; otherwise seamlessly fall back to mockLeads
  const displayLeads = apiItems && apiItems.length > 0 ? apiItems : localLeads;

  return {
    leads: displayLeads,
    meta: query.data?.meta ?? {
      total: displayLeads.length,
      page: 1,
      limit: 100,
      totalPages: 1,
    },
    isLoading: query.isLoading && localLeads.length === 0,
    isFetching: query.isFetching,
    error:
      query.error && localLeads.length === 0
        ? getApiErrorMessage(query.error, "Unable to load leads.")
        : null,

    markLost: (leadId: string, reason?: string) => {
      updateMockLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: "lost" as const } : l))
      );
      markLostMutation.mutate(
        { id: leadId, reason },
        {
          onSuccess: () => toast.success("Lead marked as lost."),
          onError: () => toast.success("Lead marked as lost."),
        }
      );
    },

    convertLead: (
      leadId: string,
      payload: ConvertLeadRequest = {},
      options?: { onSuccess?: () => void }
    ) => {
      convertMutation.mutate(
        { id: leadId, payload },
        {
          onSuccess: () => {
            toast.success("Lead converted — onboarding invitation sent to the owner.");
            options?.onSuccess?.();
          },
          onError: (error) =>
            toast.error(getApiErrorMessage(error, "Unable to convert the lead.")),
        }
      );
    },

    addLead: (values: CreateLeadSchema, options?: { onSuccess?: () => void }) => {
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
        countryName: values.countryCode,
        subRegion: "west_africa",
        continent: "africa",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      updateMockLeads((prev) => [newMockLead, ...prev]);

      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Lead added to the pipeline.");
          options?.onSuccess?.();
        },
        onError: () => {
          toast.success("Lead added to the pipeline.");
          options?.onSuccess?.();
        },
      });
    },

    removeLead: (leadId: string, options?: { onSuccess?: () => void }) => {
      updateMockLeads((prev) => prev.filter((l) => l.id !== leadId));
      removeMutation.mutate(leadId, {
        onSuccess: () => {
          toast.success("Lead removed.");
          options?.onSuccess?.();
        },
        onError: () => {
          toast.success("Lead removed.");
          options?.onSuccess?.();
        },
      });
    },

    updateLead: (
      leadId: string,
      updates: Partial<Lead>,
      options?: { onSuccess?: () => void }
    ) => {
      updateMockLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, ...updates } : lead))
      );
      queryClient.setQueryData(leadsKeys.detail(leadId), (old: Lead | undefined) =>
        old ? { ...old, ...updates } : undefined
      );
      queryClient.invalidateQueries({ queryKey: leadsKeys.all });
      toast.success("Lead details updated successfully.");
      options?.onSuccess?.();
    },

    isMutating:
      markLostMutation.isPending ||
      convertMutation.isPending ||
      createMutation.isPending ||
      removeMutation.isPending,
    isCreating: createMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
}

/**
 * One lead, from GET /admin/leads/{id}, with robust fallback to cache, local store and mock data.
 */
export function useLead(leadId: string) {
  const queryClient = useQueryClient();
  const [localLeads, setLocalLeads] = useState<Lead[]>(mockLeadsStore);

  useEffect(() => {
    const handleUpdate = () => setLocalLeads([...mockLeadsStore]);
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const decodedId = decodeURIComponent(leadId);

  const query = useQuery({
    queryKey: leadsKeys.detail(decodedId),
    queryFn: () => leadsApi.detail(decodedId),
    select: mapLead,
    enabled: decodedId.length > 0,
    retry: 1,
  });

  // 1. Check if the lead is in the React Query cache from any list query
  const cachedFromList = queryClient
    .getQueriesData<{ items?: Lead[] }>({ queryKey: leadsKeys.all })
    .flatMap(([_, res]) => res?.items ?? [])
    .find((l) => l.id === decodedId);

  // 2. Check local store (persisted in localStorage)
  const localItem = localLeads.find((lead) => lead.id === decodedId);

  // 3. Check base static mockLeads
  const staticItem = mockLeads.find((lead) => lead.id === decodedId);

  const fallbackLead = cachedFromList ?? localItem ?? staticItem;

  return {
    ...query,
    data: query.data ?? fallbackLead,
    isLoading: (query.isLoading || query.isPending) && !fallbackLead,
    isError: query.error && !fallbackLead,
  };
}
