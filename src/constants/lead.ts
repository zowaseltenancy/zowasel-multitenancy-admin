import { StatusTone } from "@/lib/statusTone";
import { LeadIntendedType, LeadSource, LeadStatus } from "@/types/lead";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  incomplete: "Incomplete",
  ready_to_convert: "Ready to Convert",
  converted: "Converted",
  lost: "Lost",
};

export const LEAD_STATUS_TONE: Record<LeadStatus, StatusTone> = {
  incomplete: "warning",
  ready_to_convert: "info",
  converted: "success",
  lost: "danger",
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  referral: "Referral",
  marketing_campaign: "Marketing Campaign",
  field_agent: "Field Agent",
  inbound_website: "Inbound (Website)",
  partner_organization: "Partner Organization",
};

export const LEAD_INTENDED_TYPE_LABELS: Record<LeadIntendedType, string> = {
  merchant: "Merchant",
  agrodealer: "Agrodealer",
  cooperative: "Cooperative",
  buyer: "Buyer",
};
