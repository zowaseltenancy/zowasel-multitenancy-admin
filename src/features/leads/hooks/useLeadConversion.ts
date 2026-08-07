"use client";

import { toast } from "sonner";
import { useLeads } from "./useLeads";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { Lead } from "@/types/lead";

// Single source of truth for "convert a lead into a real organization" — used
// by both the Leads directory and the Lead Detail page, so the conversion
// logic never drifts between the two.
export function useLeadConversion() {
  const { convertLead } = useLeads();
  const { addOrganization } = useOrganizations();

  const convert = (lead: Lead) => {
    const organizationId = `biz_${Date.now()}`;

    addOrganization({
      id: organizationId,
      businessId: organizationId,
      name: lead.businessName,
      type: lead.intendedType,
      owner: {
        name: lead.contactName,
        email: lead.email,
        phone: lead.phone,
      },
      teamMembers: [],
      kybStatus: "not_submitted",
      kybSubmittedAt: null,
      kybApprovedAt: null,
      kybRejectionReason: null,
      kybDocuments: [],
      subscriptions: [],
      countryCode: lead.countryCode,
      countryName: lead.countryName,
      subRegion: lead.subRegion,
      continent: lead.continent,
      createdAt: new Date().toISOString().slice(0, 10),
    });

    convertLead(lead.id, organizationId);
    toast.success(`${lead.businessName} converted — now a full organization pending KYB.`);
  };

  return { convert };
}
