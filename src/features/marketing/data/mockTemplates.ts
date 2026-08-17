import { MarketingTemplate } from "@/types/marketing";

export const mockTemplates: MarketingTemplate[] = [
  {
    type: "announcement",
    name: "Announcement",
    description: "New module launches, policy changes, or platform-wide news.",
    defaultHeadline: "Introducing something new on Zowasel",
    defaultBody: "We're rolling out a new update across the platform. Here's what it means for you and how to get started.",
    defaultCtaLabel: "See What's New",
  },
  {
    type: "product_listing",
    name: "Product Listing",
    description: "Marketplace commodities, pricing updates, or new offtake opportunities.",
    defaultHeadline: "New listings available on the Marketplace",
    defaultBody: "Fresh commodity listings just went live, with current pricing and available quantities in your region.",
    defaultCtaLabel: "Browse Marketplace",
  },
  {
    type: "engagement",
    name: "Engagement",
    description: "Re-activation nudges, reminders, and check-ins with existing users.",
    defaultHeadline: "We haven't seen you in a while",
    defaultBody: "Your account has updates waiting. Log back in to catch up on activity relevant to you.",
    defaultCtaLabel: "Log In Now",
  },
  {
    type: "newsletter_digest",
    name: "Newsletter Digest",
    description: "A periodic roundup of price trends, stories, and platform updates.",
    defaultHeadline: "Your latest Zowasel digest",
    defaultBody: "A roundup of what happened this period — price trends, new modules, and cooperative success stories.",
    defaultCtaLabel: "Read the Full Digest",
  },
];
