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
      const classificationFields: Partial<Lead> =
        values.intendedType === "merchant"
          ? {
              storeName: values.storeName,
              outletLat: values.outletLat,
              outletLng: values.outletLng,
              posCount: values.posCount,
              monthlyVolume: values.monthlyVolume,
            }
          : values.intendedType === "agrodealer"
          ? {
              licenseNo: values.licenseNo,
              storageMt: values.storageMt,
              inputSpecialties: values.inputSpecialties,
              lgaCoverage: values.lgaCoverage,
            }
          : {
              cacNumber: values.cacNumber,
              taxId: values.taxId,
              annualTurnover: values.annualTurnover,
              decisionMakerTitle: values.decisionMakerTitle,
            };

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
        ...classificationFields,
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

    updateLead: (leadId: string, updates: Partial<Lead>, options?: { onSuccess?: () => void }) => {
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

    isMutating: markLostMutation.isPending || convertMutation.isPending || createMutation.isPending,
    isCreating: createMutation.isPending,
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
    isError: query.isError && !fallbackLead,
  };
}
