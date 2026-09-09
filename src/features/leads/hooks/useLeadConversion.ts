"use client";

import { useLeads } from "./useLeads";
import { Lead } from "@/types/lead";

// Single source of truth for "convert a lead into a real organization" — used
// by both the Leads directory and the Lead Detail page, so the conversion
// logic never drifts between the two.
//
// This used to fabricate an organization client-side: it minted an id like
// `biz_1724... `, handed it to a local `addOrganization` (which had no endpoint
// behind it and only showed a toast), then sent that fake id to the convert
// endpoint — where it failed uuid validation, so nothing was ever converted.
//
// The server owns provisioning now. POST /admin/leads/{id}/convert with no
// tenantId creates the tenant, creates or links the owner's account with the
// OWNER membership, and emails the owner a single-use link to set a password.
// Country is deliberately left unset: KYB document requirements are driven by
// it, so the owner answers it during onboarding before they can submit KYB.
export function useLeadConversion() {
  const { convertLead, isMutating } = useLeads();

  const convert = (lead: Lead, options?: { onSuccess?: () => void }) => {
    convertLead(lead.id, undefined, undefined, options);
  };

  return { convert, isConverting: isMutating };
}
