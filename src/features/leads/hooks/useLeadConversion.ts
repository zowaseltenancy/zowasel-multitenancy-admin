"use client";

import { toast } from "sonner";
import { useLeads } from "./useLeads";
import { useOrganizations } from "@/features/organization/hooks/useOrganizations";
import { Lead, LeadIntendedType } from "@/types/lead";
import { KybStatus } from "@/types/kyb";
import { GLOBAL_COUNTRY_CURRENCIES } from "@/data/geoData";
import { OrganizationType } from "@/types/organization";

export interface ConvertLeadValues {
  ownerName?: string;
  ownerEmail?: string;
  ownerPassword?: string;
  country?: string;
  countryCode?: string;
  dateOfBirth?: string;
  businessName?: string;
  intendedType?: LeadIntendedType;
  ownerPhone?: string;
  sendActivationEmail?: boolean;
  kybStatus?: KybStatus;
  initialPlan?: string;
  notes?: string;
}

// Single source of truth for "convert a lead into a real organization" — used
// by both the Leads directory and the Lead Detail page, so the conversion
// logic never drifts between the two.
export function useLeadConversion() {
  const { convertLead } = useLeads();
  const { addOrganization } = useOrganizations();

  const convert = (lead: Lead, values?: ConvertLeadValues) => {
    const organizationId = `biz_${Date.now()}`;
    const selectedCountryCode = values?.countryCode ?? lead.countryCode ?? "NG";
    const geo = GLOBAL_COUNTRY_CURRENCIES.find((c) => c.countryCode === selectedCountryCode);

    const businessName = values?.businessName?.trim() || lead.businessName;
    const ownerName = values?.ownerName?.trim() || lead.contactName;
    const ownerEmail = values?.ownerEmail?.trim() || lead.email;
    const ownerPhone = values?.ownerPhone?.trim() || lead.phone;
    const orgType = (values?.intendedType ?? lead.intendedType) as OrganizationType;

    addOrganization({
      id: organizationId,
      businessId: organizationId,
      name: businessName,
      type: orgType,
      owner: {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        dateOfBirth: values?.dateOfBirth,
        country: values?.country ?? geo?.countryName ?? lead.countryName ?? "Nigeria",
      },
      teamMembers: [],
      kybStatus: values?.kybStatus ?? "not_submitted",
      kybSubmittedAt: values?.kybStatus === "pending" ? new Date().toISOString() : null,
      kybApprovedAt: values?.kybStatus === "approved" ? new Date().toISOString() : null,
      kybRejectionReason: null,
      kybDocuments: [],
      subscriptions: [
        {
          app: "croppilot",
          plan: values?.initialPlan ?? "Standard Plan",
          activeModules: ["farmer_management", "marketplace_billing"],
          billingState: "free",
          renewsAt: null,
        },
      ],
      countryCode: selectedCountryCode,
      countryName: geo?.countryName ?? lead.countryName ?? "Nigeria",
      subRegion: geo?.subRegion ?? lead.subRegion ?? "west_africa",
      continent: geo?.continent ?? lead.continent ?? "africa",
      createdAt: new Date().toISOString().slice(0, 10),
      notes: values?.notes ?? lead.notes,
      source: lead.source,
      onboardedByAgent: lead.source === "field_agent" ? { id: "agent_lead", name: "Field Agent" } : undefined,
    });

    convertLead(lead.id, organizationId, values?.notes ?? lead.notes);
    toast.success(`${businessName} converted — owner account initialized.`);
  };

  return { convert };
}
