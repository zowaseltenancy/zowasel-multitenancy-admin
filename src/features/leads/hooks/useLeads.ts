"use client";

import { useState } from "react";
import { Lead } from "@/types/lead";
import { mockLeads } from "../data/mockLeads";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const addLead = (lead: Lead) => {
    setLeads((current) => [lead, ...current]);
  };

  const markLost = (leadId: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId ? { ...lead, status: "lost" } : lead
      )
    );
  };

  const convertLead = (leadId: string, organizationId: string) => {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? { ...lead, status: "converted", convertedOrganizationId: organizationId }
          : lead
      )
    );
  };

  return { leads, addLead, markLost, convertLead };
}
