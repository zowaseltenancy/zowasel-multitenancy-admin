import { PlatformUserCategory } from "@/types/user";

export type MarketingChannel = "newsletter" | "sms" | "whatsapp";

export type CampaignStatus = "draft" | "scheduled" | "sending" | "sent" | "failed";

// Who a campaign targets — mirrors the platform's own user categories, plus
// "all" for a blanket send. Kept in sync with PlatformUserCategory rather
// than inventing a separate audience taxonomy.
export type CampaignAudience = PlatformUserCategory | "all";

export interface MarketingCampaign {
  id: string;
  channel: MarketingChannel;
  title: string;
  subject?: string;
  body: string;
  status: CampaignStatus;
  audience: CampaignAudience;
  scheduledAt?: string;
  sentAt?: string;
  deliveredCount: number;
  failedCount: number;
  createdAt: string;
}

export interface ChannelConnectionStatus {
  channel: "sms" | "whatsapp";
  connected: boolean;
  sessionName?: string;
  lastConnectedAt?: string;
}
