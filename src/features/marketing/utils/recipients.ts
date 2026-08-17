import { mockOrganizations } from "@/features/organization/data/mockOrganizations";
import { MarketingCampaign } from "@/types/marketing";

export interface CampaignRecipient {
  id: string;
  name: string;
  organization: string;
  contact: string;
  status: "Delivered" | "Bounced";
}

// Real names/emails/phones pulled from the org roster's actual key officers —
// cycled with a disambiguating suffix when a campaign's real send count
// exceeds the pool, rather than inventing fictional recipients per row.
const OFFICER_POOL = mockOrganizations.flatMap((org) =>
  (org.keyOfficers ?? []).map((officer) => ({
    name: officer.name,
    organization: org.name,
    email: officer.email,
    phone: officer.phone,
  }))
);

export function generateRecipients(campaign: MarketingCampaign): CampaignRecipient[] {
  const total = campaign.deliveredCount + campaign.failedCount;
  if (total === 0 || OFFICER_POOL.length === 0) return [];

  const recipients: CampaignRecipient[] = [];
  for (let i = 0; i < total; i++) {
    const officer = OFFICER_POOL[i % OFFICER_POOL.length];
    const cycle = Math.floor(i / OFFICER_POOL.length);
    recipients.push({
      id: `${campaign.id}_recipient_${i}`,
      name: cycle > 0 ? `${officer.name} (${officer.organization} #${cycle + 1})` : officer.name,
      organization: officer.organization,
      contact: campaign.channel === "newsletter" ? officer.email : officer.phone,
      status: i < campaign.deliveredCount ? "Delivered" : "Bounced",
    });
  }
  return recipients;
}
