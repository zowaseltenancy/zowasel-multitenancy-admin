"use client";

import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";
import CampaignStatusBadge from "./CampaignStatusBadge";
import { CAMPAIGN_AUDIENCE_LABELS } from "@/constants/marketing";
import { MarketingCampaign } from "@/types/marketing";
import { Button } from "@/components/ui/button";

interface Props {
  campaigns: MarketingCampaign[];
}

export default function CampaignTable({ campaigns }: Props) {
  return (
    <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3.5">Campaign Title & Body</th>
              <th className="p-3.5">Target Audience</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Delivered / Failed</th>
              <th className="p-3.5">Scheduled / Sent</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y font-semibold">
            {campaigns.map((campaign) => {
              const channelPath = campaign.channel === "newsletter" ? "newsletters" : campaign.channel;
              const detailHref = `/admin/marketing/${channelPath}/${campaign.id}`;

              return (
                <tr
                  key={campaign.id}
                  className="hover:bg-muted/40 transition-colors group cursor-pointer"
                  onClick={() => {
                    window.location.href = detailHref;
                  }}
                >
                  <td className="p-3.5">
                    <Link
                      href={detailHref}
                      className="font-bold text-sm text-foreground hover:text-primary group-hover:underline block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {campaign.title}
                    </Link>
                    <div className="text-xs text-muted-foreground line-clamp-1 font-normal mt-0.5">
                      {campaign.body}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold text-foreground border">
                      {CAMPAIGN_AUDIENCE_LABELS[campaign.audience]}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <CampaignStatusBadge status={campaign.status} />
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="text-emerald-600 font-bold">{campaign.deliveredCount.toLocaleString()}</span>
                    <span className="text-muted-foreground"> / </span>
                    <span className={campaign.failedCount > 0 ? "text-rose-600 font-bold" : "text-muted-foreground"}>
                      {campaign.failedCount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground text-[11px]">
                    {campaign.sentAt
                      ? new Date(campaign.sentAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      : campaign.scheduledAt
                      ? `Sched: ${new Date(campaign.scheduledAt).toLocaleDateString()}`
                      : "—"}
                  </td>
                  <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Link href={detailHref}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-bold gap-1 cursor-pointer border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
