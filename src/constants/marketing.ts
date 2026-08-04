import { StatusTone } from "@/lib/statusTone";
import { CampaignAudience, CampaignStatus, MarketingChannel } from "@/types/marketing";

export const MARKETING_CHANNEL_LABELS: Record<MarketingChannel, string> = {
  newsletter: "Newsletter",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
};

export const CAMPAIGN_STATUS_TONE: Record<CampaignStatus, StatusTone> = {
  draft: "neutral",
  scheduled: "info",
  sending: "warning",
  sent: "success",
  failed: "danger",
};

// Matches the icon colors already assigned per channel on the Marketing Pro
// overview page (src/app/(dashboard)/admin/marketing/page.tsx).
export const MARKETING_CHANNEL_COLORS: Record<MarketingChannel, string> = {
  newsletter: "bg-cyan-500",
  sms: "bg-amber-500",
  whatsapp: "bg-emerald-500",
};

export const CAMPAIGN_AUDIENCE_LABELS: Record<CampaignAudience, string> = {
  all: "All Platform Users",
  agent: "Field Agents",
  merchant: "Merchants",
  agrodealer: "Agrodealers",
  cooperative: "Cooperatives",
  buyer: "Buyers",
  staff: "Zowasel Staff",
};
