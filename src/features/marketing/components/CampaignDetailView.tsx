"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Copy,
  MousePointerClick,
  MailOpen,
  MessageSquareReply,
  Ban,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportMenu from "@/components/shared/ExportMenu";
import CampaignStatusBadge from "./CampaignStatusBadge";
import MessagePreview, { ChannelPreviewIcon } from "./MessagePreview";
import RecipientListView from "./RecipientListView";
import { generateRecipients } from "../utils/recipients";
import { useCampaigns } from "../hooks/useCampaigns";
import { MARKETING_CHANNEL_LABELS, CAMPAIGN_AUDIENCE_LABELS } from "@/constants/marketing";
import { MarketingChannel } from "@/types/marketing";
import { toast } from "sonner";

interface Props {
  campaignId: string;
  channel: MarketingChannel;
}

export default function CampaignDetailView({ campaignId, channel }: Props) {
  const { campaigns } = useCampaigns();

  const campaign = useMemo(
    () => campaigns.find((c) => c.id === campaignId || c.id === `camp_${campaignId}`),
    [campaigns, campaignId]
  );

  if (!campaign) {
    return (
      <div className="space-y-6">
        <Link
          href={`/admin/marketing/${channel === "newsletter" ? "newsletters" : channel}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {MARKETING_CHANNEL_LABELS[channel]} Campaigns
        </Link>

        <Card className="border shadow-2xs">
          <CardContent className="p-12 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
            <h2 className="text-lg font-bold">Campaign Not Found</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t locate a {MARKETING_CHANNEL_LABELS[channel]} campaign with ID &ldquo;{campaignId}&rdquo;.
            </p>
            <Link href={`/admin/marketing/${channel === "newsletter" ? "newsletters" : channel}`}>
              <Button size="sm" className="mt-2">
                Return to {MARKETING_CHANNEL_LABELS[channel]}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const channelHref = `/admin/marketing/${channel === "newsletter" ? "newsletters" : channel}`;
  const totalAttempted = campaign.deliveredCount + campaign.failedCount;
  const deliveryRate = totalAttempted > 0 ? ((campaign.deliveredCount / totalAttempted) * 100).toFixed(1) : "100.0";

  const handleCopyBody = () => {
    navigator.clipboard.writeText(campaign.body);
    toast.success("Campaign message copied to clipboard.");
  };

  const { engagement } = campaign;
  const openRate = campaign.deliveredCount > 0 ? ((engagement.openedCount / campaign.deliveredCount) * 100).toFixed(1) : "0.0";
  const clickRate = engagement.openedCount > 0 ? ((engagement.clickedCount / engagement.openedCount) * 100).toFixed(1) : "0.0";
  const replyRate = campaign.deliveredCount > 0 ? ((engagement.repliedCount / campaign.deliveredCount) * 100).toFixed(1) : "0.0";
  const tracksOpens = campaign.channel !== "sms";
  const tracksClicks = campaign.channel === "newsletter";
  const tracksReplies = campaign.channel !== "newsletter";
  const recipients = generateRecipients(campaign);

  const exportTable = {
    title: `Campaign Details - ${campaign.title}`,
    headers: ["Property", "Value"],
    rows: [
      ["Campaign Title", campaign.title],
      ["Channel", MARKETING_CHANNEL_LABELS[campaign.channel]],
      ["Target Audience", CAMPAIGN_AUDIENCE_LABELS[campaign.audience]],
      ["Subject Line", campaign.subject || "N/A"],
      ["Message Body", campaign.body],
      ["Status", campaign.status.toUpperCase()],
      ["Delivered Count", campaign.deliveredCount.toLocaleString()],
      ["Failed Count", campaign.failedCount.toLocaleString()],
      ["Delivery Rate", `${deliveryRate}%`],
      ["Opened", tracksOpens ? engagement.openedCount.toLocaleString() : "N/A for this channel"],
      ["Open Rate", tracksOpens ? `${openRate}%` : "N/A for this channel"],
      ["Clicked", tracksClicks ? engagement.clickedCount.toLocaleString() : "N/A for this channel"],
      ["Click Rate", tracksClicks ? `${clickRate}%` : "N/A for this channel"],
      ["Replied", tracksReplies ? engagement.repliedCount.toLocaleString() : "N/A for this channel"],
      ["Bounced", engagement.bouncedCount.toLocaleString()],
      ["Unsubscribed", engagement.unsubscribedCount.toLocaleString()],
      ["Created Date", campaign.createdAt],
      ["Sent / Scheduled Date", campaign.sentAt || campaign.scheduledAt || "N/A"],
    ],
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={channelHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {MARKETING_CHANNEL_LABELS[channel]} Campaigns
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{campaign.title}</h1>
            <CampaignStatusBadge status={campaign.status} />
            <span className="text-xs font-mono font-bold bg-muted px-2.5 py-1 rounded-md text-muted-foreground border">
              ID: {campaign.id}
            </span>
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground font-medium">
            Created on {new Date(campaign.createdAt).toLocaleDateString()} &bull; Target Audience:{" "}
            <span className="font-bold text-foreground">{CAMPAIGN_AUDIENCE_LABELS[campaign.audience]}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportMenu
            table={exportTable}
            filename={`Campaign_${campaign.id}_Report`}
            captureElementId={`campaign-report-${campaign.id}`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyBody}
            className="h-9 text-xs font-bold gap-1.5 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" /> Copy Message
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid + Main Content Grid — this is what "Export as Image" captures */}
      <div id={`campaign-report-${campaign.id}`} className="space-y-8 bg-background">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border bg-card shadow-2xs">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Recipients</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">
              {totalAttempted > 0 ? totalAttempted.toLocaleString() : campaign.deliveredCount > 0 ? campaign.deliveredCount.toLocaleString() : "Pending"}
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">
              Audience: {CAMPAIGN_AUDIENCE_LABELS[campaign.audience]}
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Successfully Delivered</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {campaign.deliveredCount.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">
              {deliveryRate}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Failed / Bounced</p>
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="mt-1 text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {campaign.failedCount.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">
              {campaign.failedCount > 0 ? "Inspect gateway errors" : "Zero delivery errors"}
            </p>
          </CardContent>
        </Card>

        <Card className="border bg-card shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dispatch Timestamp</p>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 text-sm font-bold text-foreground truncate">
              {campaign.sentAt
                ? new Date(campaign.sentAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
                : campaign.scheduledAt
                ? `Scheduled: ${new Date(campaign.scheduledAt).toLocaleDateString()}`
                : "Draft — Not sent"}
            </p>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">
              Channel: {MARKETING_CHANNEL_LABELS[campaign.channel]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid: Live Message Preview on Left, Real Campaign Statistics on Right */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Live Message Preview */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ChannelPreviewIcon channel={channel} className="h-4 w-4 text-primary" />
                Live Message Preview & Layout
              </CardTitle>
              <CardDescription className="text-xs">
                Rendered visual representation as received on the end-user&apos;s device.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <MessagePreview
                channel={channel}
                title={campaign.subject || campaign.title}
                body={campaign.body}
                audienceLabel={CAMPAIGN_AUDIENCE_LABELS[campaign.audience]}
                heroImageUrl={campaign.heroImageUrl}
                ctaLabel={campaign.ctaLabel}
                timestamp={campaign.sentAt}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real Campaign Statistics */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Campaign Statistics</CardTitle>
              <CardDescription className="text-xs">
                Engagement funnel derived from this campaign&apos;s actual delivery record.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-xs font-semibold">
              <div className="flex items-center justify-between border-b py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Delivered
                </span>
                <span className="font-bold text-foreground">{campaign.deliveredCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between border-b py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MailOpen className="h-3.5 w-3.5 text-sky-600" /> {channel === "whatsapp" ? "Read" : "Opened"}
                </span>
                <span className="font-bold text-foreground">
                  {tracksOpens ? `${engagement.openedCount.toLocaleString()} (${openRate}%)` : "N/A for SMS"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MousePointerClick className="h-3.5 w-3.5 text-violet-600" /> Clicked
                </span>
                <span className="font-bold text-foreground">
                  {tracksClicks ? `${engagement.clickedCount.toLocaleString()} (${clickRate}%)` : "N/A for this channel"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MessageSquareReply className="h-3.5 w-3.5 text-amber-600" /> Replied
                </span>
                <span className="font-bold text-foreground">
                  {tracksReplies ? `${engagement.repliedCount.toLocaleString()} (${replyRate}%)` : "N/A for this channel"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> Bounced / Failed
                </span>
                <span className="font-bold text-foreground">{campaign.failedCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Ban className="h-3.5 w-3.5 text-muted-foreground" /> Unsubscribed
                </span>
                <span className="font-bold text-foreground">{engagement.unsubscribedCount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      <RecipientListView recipients={recipients} />
    </div>
  );
}
