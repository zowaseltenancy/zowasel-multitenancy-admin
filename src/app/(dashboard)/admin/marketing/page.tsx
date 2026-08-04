"use client";

import Link from "next/link";
import { ArrowRight, Mail, MessageSquare, MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useCampaigns } from "@/features/marketing/hooks/useCampaigns";
import { MarketingChannel } from "@/types/marketing";
import { MARKETING_CHANNEL_LABELS } from "@/constants/marketing";

const CHANNEL_META: Record<
  MarketingChannel,
  { icon: typeof Mail; href: string; cardBg: string; iconClassName: string }
> = {
  newsletter: {
    icon: Mail,
    href: "/admin/marketing/newsletters",
    cardBg: "bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20",
    iconClassName: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:text-cyan-400",
  },
  sms: {
    icon: MessageSquare,
    href: "/admin/marketing/sms",
    cardBg: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20",
    iconClassName: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  whatsapp: {
    icon: MessageCircle,
    href: "/admin/marketing/whatsapp",
    cardBg: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20",
    iconClassName: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
};

const CHANNELS = Object.keys(CHANNEL_META) as MarketingChannel[];

export default function MarketingProOverviewPage() {
  const { campaigns } = useCampaigns();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketing Pro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Newsletters, SMS, and WhatsApp campaigns in one standardized workflow —{" "}
          {campaigns.length} campaigns tracked across all channels.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CHANNELS.map((channel) => {
          const meta = CHANNEL_META[channel];
          const Icon = meta.icon;
          const count = campaigns.filter((c) => c.channel === channel).length;
          const sentCount = campaigns.filter((c) => c.channel === channel && c.status === "sent").length;

          return (
            <Link key={channel} href={meta.href} className="group block">
              <Card className={`border shadow-2xs transition-all hover:scale-[1.02] ${meta.cardBg}`}>
                <CardContent className="flex flex-col justify-between p-5 min-h-[130px]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{MARKETING_CHANNEL_LABELS[channel]}</p>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${meta.iconClassName}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">{sentCount} sent</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
