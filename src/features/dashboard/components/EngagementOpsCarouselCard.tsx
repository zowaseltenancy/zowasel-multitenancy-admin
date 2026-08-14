"use client";

import { useState, useEffect } from "react";
import { Layers, ChevronLeft, ChevronRight, Target, Megaphone, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import StatusSegmentedBar from "@/components/shared/StatusSegmentedBar";
import CategoryChipRow from "@/components/shared/CategoryChipRow";
import { LEAD_STATUS_LABELS } from "@/constants/lead";
import { MARKETING_CHANNEL_COLORS, MARKETING_CHANNEL_LABELS } from "@/constants/marketing";
import { Lead } from "@/types/lead";
import { MarketingCampaign, MarketingChannel } from "@/types/marketing";

const MARKETING_CHANNELS: MarketingChannel[] = ["newsletter", "sms", "whatsapp"];

interface Props {
  activeModulesCount: number;
  leads: Lead[];
  campaigns: MarketingCampaign[];
  isExpanded?: boolean;
}

const TABS = [
  { key: "modules", label: "Active Modules", icon: Layers, color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { key: "leads", label: "Leads Pipeline", icon: Target, color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  { key: "campaigns", label: "Marketing Campaigns", icon: Megaphone, color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20" },
];

export default function EngagementOpsCarouselCard({
  activeModulesCount,
  leads,
  campaigns,
  isExpanded = false,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TABS.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const activeTab = TABS[currentIndex];

  const sentCampaignsCount = campaigns.filter((c) => c.status === "sent").length;
  const readyLeadsCount = leads.filter((l) => l.status === "ready_to_convert").length;

  const leadSegments = (["incomplete", "ready_to_convert", "converted", "lost"] as const).map((status) => ({
    label: LEAD_STATUS_LABELS[status],
    count: leads.filter((l) => l.status === status).length,
    tone:
      status === "incomplete"
        ? ("warning" as const)
        : status === "ready_to_convert"
        ? ("info" as const)
        : status === "converted"
        ? ("success" as const)
        : ("danger" as const),
  }));

  const campaignChannelChips = MARKETING_CHANNELS.map((channel) => ({
    label: MARKETING_CHANNEL_LABELS[channel],
    count: campaigns.filter((c) => c.channel === channel && c.status === "sent").length,
    colorClass: MARKETING_CHANNEL_COLORS[channel],
  }));

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TABS.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
  };

  const Icon = activeTab.icon;

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Engagement & Ops
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20 shrink-0 whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3" /> {formatCompactMetric(readyLeadsCount)} Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-rose-500/5 border-rose-500/20 min-w-0 overflow-hidden" title={`${activeModulesCount.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Active Modules</p>
              <p className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(activeModulesCount)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${leads.length.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Pipeline Leads</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(leads.length)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Ready: {formatCompactMetric(readyLeadsCount)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Campaigns: {formatCompactMetric(sentCampaignsCount)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Engagement, CropPilot Modules & Growth Leads
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{activeModulesCount.toLocaleString()} Subscribed Module Instances</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev Section
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {TABS.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Section <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {TABS.map((t, idx) => (
            <button
              key={t.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 min-w-[90px] py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center whitespace-nowrap",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab.key === "modules" && (
          <div className="p-4 border rounded-xl bg-muted/20 min-w-0 overflow-hidden">
            <div className="p-4 border rounded-xl bg-card max-w-xs min-w-0 overflow-hidden">
              <p className="text-xs font-bold uppercase text-muted-foreground truncate">Subscribed Module Instances</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2 truncate">{activeModulesCount.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Across all organizations in scope</p>
            </div>
          </div>
        )}

        {activeTab.key === "leads" && (
          <div className="p-4 border rounded-xl bg-muted/20 min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-3 truncate">
              {leads.length.toLocaleString()} Leads in Pipeline
            </p>
            <StatusSegmentedBar segments={leadSegments} />
          </div>
        )}

        {activeTab.key === "campaigns" && (
          <div className="p-4 border rounded-xl bg-muted/20 min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-3 truncate">
              {sentCampaignsCount.toLocaleString()} Campaigns Sent, by Channel
            </p>
            <CategoryChipRow items={campaignChannelChips} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
