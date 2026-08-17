"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CampaignTable from "./CampaignTable";
import ConnectionStatusCard from "./ConnectionStatusCard";
import NewCampaignDialog from "./NewCampaignDialog";
import { useCampaigns } from "../hooks/useCampaigns";
import { useConnections } from "../hooks/useConnections";
import { MARKETING_CHANNEL_LABELS } from "@/constants/marketing";
import { MarketingChannel } from "@/types/marketing";
import { CreateCampaignSchema } from "@/schemas/marketing.schema";

interface Props {
  channel: MarketingChannel;
}

export default function CampaignChannelView({ channel }: Props) {
  const { campaigns, addCampaign } = useCampaigns();
  const { connections, reconnect } = useConnections();
  const [createOpen, setCreateOpen] = useState(false);

  const channelCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.channel === channel),
    [campaigns, channel]
  );

  const connection = connections.find((c) => c.channel === channel);

  const handleCreate = (values: CreateCampaignSchema) => {
    addCampaign({
      id: `camp_${Date.now()}`,
      channel: values.channel,
      templateType: values.templateType,
      title: values.title,
      subject: values.subject,
      body: values.body,
      heroImageUrl: values.heroImageUrl || undefined,
      ctaLabel: values.ctaLabel || undefined,
      ctaUrl: values.ctaUrl || undefined,
      audience: values.audience,
      status: values.scheduledAt ? "scheduled" : "sending",
      scheduledAt: values.scheduledAt || undefined,
      sentAt: values.scheduledAt ? undefined : new Date().toISOString(),
      deliveredCount: 0,
      failedCount: 0,
      engagement: { openedCount: 0, clickedCount: 0, bouncedCount: 0, unsubscribedCount: 0, repliedCount: 0 },
      createdAt: new Date().toISOString().slice(0, 10),
    });

    toast.success(
      values.scheduledAt
        ? `${values.title} scheduled.`
        : `${values.title} is sending now.`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {MARKETING_CHANNEL_LABELS[channel]} Campaigns
          </h1>
          <p className="mt-2 text-muted-foreground">
            {channelCampaigns.length} campaigns tracked for this channel.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <NewCampaignDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        channel={channel}
        onCreate={handleCreate}
      />

      {connection && <ConnectionStatusCard connection={connection} onReconnect={reconnect} />}

      {channelCampaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
            No {MARKETING_CHANNEL_LABELS[channel].toLowerCase()} campaigns yet.
          </CardContent>
        </Card>
      ) : (
        <CampaignTable campaigns={channelCampaigns} />
      )}
    </div>
  );
}
