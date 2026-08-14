"use client";

import { useState, useEffect } from "react";
import { Sprout, ShoppingBag, Gavel, Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { CommodityMarketSummary } from "@/types/crop";

interface Props {
  summary: CommodityMarketSummary;
  isExpanded?: boolean;
}

const TABS = [
  { key: "total", label: "Total Crops", icon: Sprout, color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { key: "sale", label: "For Sale", icon: ShoppingBag, color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20" },
  { key: "auction", label: "For Auction", icon: Gavel, color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  { key: "wanted", label: "Wanted Crops", icon: Search, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
];

export default function CropMarketCarouselCard({ summary, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TABS.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const activeTab = TABS[currentIndex];

  const getCount = (key: string) => {
    switch (key) {
      case "total": return summary.totalCrops;
      case "sale": return summary.cropsForSale;
      case "auction": return summary.cropsForAuction;
      case "wanted": return summary.wantedCrops;
      default: return 0;
    }
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TABS.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TABS.length) % TABS.length);
  };

  const Icon = activeTab.icon;
  const count = getCount(activeTab.key);

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Sprout className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Commodity Market
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 shrink-0 whitespace-nowrap">
              <TrendingUp className="h-3 w-3" /> High Liquidity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 min-w-0 overflow-hidden" title={`${summary.totalCrops.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Total Listings</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(summary.totalCrops)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${summary.wantedCrops.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Demand Req.</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(summary.wantedCrops)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">For Sale: {formatCompactMetric(summary.cropsForSale)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Auction: {formatCompactMetric(summary.cropsForAuction)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Wanted: {formatCompactMetric(summary.wantedCrops)}</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Crops & Agro-Commodity Marketplace Distribution
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{summary.totalCrops.toLocaleString()} Total Listed Commodities</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev Tab
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {TABS.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Tab <ChevronRight className="h-4 w-4 ml-1" />
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="p-4 border rounded-xl bg-card min-w-0 overflow-hidden">
            <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-extrabold border mb-1", activeTab.color)}>
              <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{activeTab.label}</span>
            </span>
            <p className="text-2xl sm:text-3xl font-black text-foreground mt-2 truncate">{count.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Active Commodities Listed</p>
          </div>

          <div className="p-4 border rounded-xl bg-emerald-500/5 border-emerald-500/20 min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Direct Sale Listings</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2 truncate">{summary.cropsForSale.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Instant Buy Offers</p>
          </div>

          <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20 min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Offtaker Demands</p>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2 truncate">{summary.wantedCrops.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1 truncate">Sourcing Requirements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
