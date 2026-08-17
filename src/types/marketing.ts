import { PlatformUserCategory } from "@/types/user";

export type MarketingChannel = "newsletter" | "sms" | "whatsapp";

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

// Who a campaign targets — mirrors the platform's own user categories, plus
// "all" for a blanket send. Kept in sync with PlatformUserCategory rather
// than inventing a separate audience taxonomy.
export type CampaignAudience = PlatformUserCategory | "all";

// The starting point for a new campaign — picking one prefills tone/content
// rather than starting from a blank form. Visual block editing (hero image,
// CTA) only applies to the newsletter channel; SMS/WhatsApp just inherit the
// starter body copy, matching how real platforms scope template editors to email.
export type MarketingTemplateType = "announcement" | "product_listing" | "engagement" | "newsletter_digest";

export interface MarketingTemplate {
  type: MarketingTemplateType;
  name: string;
  description: string;
  defaultHeadline: string;
  defaultBody: string;
  defaultCtaLabel: string;
}

// Real per-channel engagement funnel, always present and always internally
// consistent (clicked <= opened <= deliveredCount) — replaces the old
// fabricated, identical-per-campaign metadata. Not every field is meaningful
// on every channel (e.g. "unsubscribed" barely applies to SMS) — components
// decide what to surface per channel, the data itself stays honest.
export interface CampaignEngagement {
  openedCount: number; // email opens, or WhatsApp read receipts
  clickedCount: number; // in-message link clicks
  bouncedCount: number; // hard + soft bounces, a subset of failedCount
  unsubscribedCount: number; // opt-outs triggered by this specific send
  repliedCount: number; // inbound replies received
}

export interface MarketingCampaign {
  id: string;
  channel: MarketingChannel;
  templateType?: MarketingTemplateType;
  title: string;
  subject?: string;
  body: string;
  // Newsletter-only block content — undefined for SMS/WhatsApp.
  heroImageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  status: CampaignStatus;
  audience: CampaignAudience;
  scheduledAt?: string;
  sentAt?: string;
  deliveredCount: number;
  failedCount: number;
  engagement: CampaignEngagement;
  createdAt: string;
}

export interface ChannelConnectionStatus {
  channel: "sms" | "whatsapp";
  connected: boolean;
  sessionName?: string;
  lastConnectedAt?: string;
}
