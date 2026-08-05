"use client";

import { useState, useEffect } from "react";
import { Sprout, ShoppingBag, Gavel, Search, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <Card className="h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none">
                  Commodity Market
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> High Liquidity
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Total Listings</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{summary.totalCrops.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Demand Req.</p>
              <p className="text-2xl font-extrabold text-foreground mt-0.5">{summary.wantedCrops.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1 border-t">
            <span>For Sale: {summary.cropsForSale.toLocaleString()}</span>
            <span>&bull;</span>
            <span>Auction: {summary.cropsForAuction.toLocaleString()}</span>
            <span>&bull;</span>
            <span>Wanted: {summary.wantedCrops.toLocaleString()}</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Crops & Agro-Commodity Marketplace Distribution
              </p>
              <h3 className="text-2xl font-extrabold text-foreground">{summary.totalCrops.toLocaleString()} Total Listed Commodities</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
            <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-extrabold border mb-1", activeTab.color)}>
              <Icon className="h-4 w-4" /> {activeTab.label}
            </span>
            <p className="text-3xl font-black text-foreground mt-2">{count.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Active Commodities Listed</p>
          </div>

          <div className="p-4 border rounded-xl bg-emerald-500/5 border-emerald-500/20">
            <p className="text-xs font-bold uppercase text-muted-foreground">Direct Sale Listings</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">{summary.cropsForSale.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Instant Buy Offers</p>
          </div>

          <div className="p-4 border rounded-xl bg-indigo-500/5 border-indigo-500/20">
            <p className="text-xs font-bold uppercase text-muted-foreground">Offtaker Demands</p>
            <p className="text-3xl font-black text-indigo-600 mt-2">{summary.wantedCrops.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground mt-1">Sourcing Requirements</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
