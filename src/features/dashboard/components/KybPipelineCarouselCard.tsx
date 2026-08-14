"use client";

import { useState, useEffect } from "react";
import { FileCheck, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCompactMetric } from "@/lib/utils";
import { Organization } from "@/types/organization";
import { KybStatus } from "@/types/kyb";

interface Props {
  organizations: Organization[];
  isExpanded?: boolean;
}

const STATUSES: { key: KybStatus; label: string; tone: "neutral" | "warning" | "success" | "danger" }[] = [
  { key: "not_submitted", label: "Not Submitted", tone: "neutral" },
  { key: "pending", label: "Pending Review", tone: "warning" },
  { key: "approved", label: "Approved", tone: "success" },
  { key: "rejected", label: "Rejected", tone: "danger" },
];

const TONE_CLASSES = {
  neutral: "bg-muted text-muted-foreground border-border",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  danger: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
};

export default function KybPipelineCarouselCard({ organizations, isExpanded = false }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isExpanded) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUSES.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isExpanded]);

  const active = STATUSES[currentIndex];
  const activeCount = organizations.filter((o) => o.kybStatus === active.key).length;
  const totalCount = organizations.length;
  const percentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const pendingCount = organizations.filter((o) => o.kybStatus === "pending").length;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % STATUSES.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + STATUSES.length) % STATUSES.length);
  };

  // SUMMARY VIEW (Landing 8-Card Grid)
  if (!isExpanded) {
    return (
      <Card className="h-full min-h-[210px] flex flex-col justify-between border shadow-2xs bg-card overflow-hidden">
        <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-2.5">
          <div className="flex items-center justify-between gap-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <FileCheck className="h-4 w-4" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-none truncate">
                KYB Pipeline
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-500/20 shrink-0 whitespace-nowrap">
              <Clock className="h-3 w-3" /> 3.2d SLA
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-w-0">
            <div className="p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20 min-w-0 overflow-hidden" title={`${pendingCount.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Pending Review</p>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(pendingCount)}</p>
            </div>
            <div className="p-2.5 rounded-lg border bg-muted/30 min-w-0 overflow-hidden" title={`${totalCount.toLocaleString()}`}>
              <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">Total Ingested</p>
              <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5 truncate tracking-tight tabular-nums">{formatCompactMetric(totalCount)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground pt-1.5 border-t border-border/60 min-w-0 overflow-hidden">
            <span className="truncate">Approved: {formatCompactMetric(organizations.filter(o => o.kybStatus === 'approved').length)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Pending: {formatCompactMetric(pendingCount)}</span>
            <span className="shrink-0 mx-1">&bull;</span>
            <span className="truncate">Rejected: {formatCompactMetric(organizations.filter(o => o.kybStatus === 'rejected').length)}</span>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                KYB Verification Pipeline & Approval SLA
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{totalCount.toLocaleString()} Applications Processed</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={prevSlide}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Status
            </Button>
            <span className="text-xs font-mono font-bold text-muted-foreground px-2">
              {currentIndex + 1} / {STATUSES.length}
            </span>
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold cursor-pointer" onClick={nextSlide}>
              Next Status <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1.5 bg-muted/60 rounded-xl overflow-x-auto">
          {STATUSES.map((s, idx) => (
            <button
              key={s.key}
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
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-4 border rounded-xl bg-muted/20">
          <div className="min-w-0 overflow-hidden">
            <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-extrabold border mb-1", TONE_CLASSES[active.tone])}>
              {active.label}
            </span>
            <p className="text-2xl sm:text-3xl font-black text-foreground mt-1 truncate">{activeCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-muted-foreground truncate">Applications</p>
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Ratio of Total</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 truncate">{percentage}%</p>
            <p className="text-xs font-bold text-muted-foreground truncate">Of Total Submissions</p>
          </div>

          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-bold uppercase text-muted-foreground truncate">Turnaround Speed</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 truncate">3.2 Days</p>
            <p className="text-xs font-bold text-muted-foreground truncate">Average SLA</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
