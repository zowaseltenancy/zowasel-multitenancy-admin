"use client";

import { useState, useEffect } from "react";
import { Layers, ChevronLeft, ChevronRight, Target, Megaphone, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lead } from "@/types/lead";
import { MarketingCampaign } from "@/types/marketing";

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
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden transition-all duration-200">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  Engagement & Ops
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-500/20">
              <CheckCircle2 className="h-3 w-3" /> {readyLeadsCount} Ready Leads
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-rose-500/5 border-rose-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Active Modules</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-0.5">{activeModulesCount}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Pipeline Leads</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{leads.length}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>Ready: {readyLeadsCount}</span>
            <span>&bull;</span>
            <span>Campaigns Sent: {sentCampaignsCount}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Engagement, CropPilot Modules & Growth Leads
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">{activeModulesCount} Subscribed Module Instances</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="w-full flex items-center gap-2 p-1.5 bg-muted/60 rounded-xl">
          {TABS.map((t, idx) => (
            <button
              key={t.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={cn(
                "flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer text-center",
                currentIndex === idx
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-foreground hover:bg-card"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="p-4 border rounded-xl bg-card">
            <p className="text-xs font-bold uppercase text-muted-foreground">Subscribed Modules</p>
            <p className="text-3xl font-black text-rose-600 mt-2">{activeModulesCount}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Tenant Subscriptions</p>
          </div>

          <div className="p-4 border rounded-xl bg-sky-500/5 border-sky-500/20">
            <p className="text-xs font-bold uppercase text-muted-foreground">Leads Pipeline</p>
            <p className="text-3xl font-black text-sky-600 mt-2">{leads.length}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">{readyLeadsCount} Ready to Convert</p>
          </div>

          <div className="p-4 border rounded-xl bg-purple-500/5 border-purple-500/20">
            <p className="text-xs font-bold uppercase text-muted-foreground">Broadcast Campaigns</p>
            <p className="text-3xl font-black text-purple-600 mt-2">{sentCampaignsCount}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Delivered Messages</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
