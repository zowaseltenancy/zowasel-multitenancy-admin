"use client";

import { useState, useEffect } from "react";
import { Building2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { Organization } from "@/types/organization";
import { ORGANIZATION_TYPE_LABELS, ORGANIZATION_TYPE_COLORS } from "@/constants/organization";

interface Props {
  organizations: Organization[];
  isExpanded?: boolean;
}

const TYPES: ("merchant" | "agrodealer" | "cooperative" | "buyer")[] = [
  "merchant",
  "agrodealer",
  "cooperative",
  "buyer",
];

export default function OrganizationsCarouselCard({ organizations, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TYPES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [isExpanded]);

  const activeType = TYPES[currentIndex];
  const activeCount = organizations.filter((o) => o.type === activeType).length;
  const totalCount = organizations.length;
  const percentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const verifiedCount = organizations.filter((o) => o.kybStatus === "approved").length;
  const verifiedPct = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % TYPES.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + TYPES.length) % TYPES.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid) - Exactly 2 Summary Metrics
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                Organizations
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 shrink-0 whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3" /> {verifiedPct}% KYB
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${totalCount.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Total Orgs</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(totalCount)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-emerald-500/5 border-emerald-500/20 min-w-0 overflow-hidden" title={`${verifiedCount.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Verified KYB</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(verifiedCount)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Merchants: {formatCompactMetric(organizations.filter(o => o.type === 'merchant').length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Buyers: {formatCompactMetric(organizations.filter(o => o.type === 'buyer').length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Agrodealers: {formatCompactMetric(organizations.filter(o => o.type === 'agrodealer').length)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // EXPANDED VIEW (Full Focus Overview)
  return (
    <Card className="min-h-[360px] flex flex-col justify-between border shadow-md bg-card overflow-hidden">
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                Organizations Overview & KYB Breakdown
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{totalCount.toLocaleString()} Registered Businesses</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Type
            </Button>

            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {TYPES.length}
            </span>

            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Type <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {TYPES.map((t, idx) => (
            <button
              key={t}
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
              {ORGANIZATION_TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="min-w-0 overflow-hidden">
            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-extrabold border mb-1", ORGANIZATION_TYPE_COLORS[activeType])}>
              {ORGANIZATION_TYPE_LABELS[activeType]}
            </span>
            <p className="text-2xl sm:text-3xl font-black text-foreground mt-1 truncate">{activeCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground truncate">Registered Accounts</p>
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Share of Portfolio</p>
            <p className="text-2xl sm:text-3xl font-black text-cyan-600 mt-1 truncate">{percentage}%</p>
            <p className="text-xs font-bold text-muted-foreground truncate">Of Total Organizations</p>
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Verification Pass Rate</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 truncate">{verifiedPct}%</p>
            <p className="text-xs font-bold text-muted-foreground truncate">KYB Compliant</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
