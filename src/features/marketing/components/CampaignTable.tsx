import CampaignStatusBadge from "./CampaignStatusBadge";
import { CAMPAIGN_AUDIENCE_LABELS } from "@/constants/marketing";
import { MarketingCampaign } from "@/types/marketing";

interface Props {
  campaigns: MarketingCampaign[];
}

export default function CampaignTable({ campaigns }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Campaign</th>
              <th className="p-4">Audience</th>
              <th className="p-4">Status</th>
              <th className="p-4">Delivered / Failed</th>
              <th className="p-4">Scheduled / Sent</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">
                  <div className="font-semibold text-foreground">{campaign.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{campaign.body}</div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {CAMPAIGN_AUDIENCE_LABELS[campaign.audience]}
                </td>
                <td className="p-4">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td className="p-4 text-muted-foreground">
                  {campaign.deliveredCount.toLocaleString()} / {campaign.failedCount.toLocaleString()}
                </td>
                <td className="p-4 text-muted-foreground">
                  {campaign.sentAt
                    ? new Date(campaign.sentAt).toLocaleString()
                    : campaign.scheduledAt
                    ? new Date(campaign.scheduledAt).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
