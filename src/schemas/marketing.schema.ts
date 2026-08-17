import { z } from "zod";

export const createCampaignSchema = z.object({
  channel: z.enum(["newsletter", "sms", "whatsapp"]),
  templateType: z.enum(["announcement", "product_listing", "engagement", "newsletter_digest"]),
  title: z.string().min(2, "Title must be at least 2 characters"),
  subject: z.string().optional(),
  body: z.string().min(5, "Message body must be at least 5 characters"),
  // Newsletter-only block content — left blank for SMS/WhatsApp.
  heroImageUrl: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  // Staff are never a marketing audience — campaigns target tenant/platform users only.
  audience: z.enum(["all", "agent", "merchant", "agrodealer", "cooperative", "buyer"]),
  scheduledAt: z.string().optional(),
});

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
